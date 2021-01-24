import joplin from "api";
import JoplinData from 'api/JoplinData';
import {MenuItemLocation, Path} from 'api/types';
import pos from "retext-pos";
import keywords from "retext-keywords";
import toString from "nlcst-to-string";
import strip from "strip-markdown";
import english from "retext-english";
import remark2retext from "remark-retext";
import stringify from "remark-stringify";
import parse from "remark-parse";
import unified from "unified";

async function getAll(api: JoplinData, path: Path, query: any): Promise<any[]> {
    query.page = 1;
    let response = await api.get(path, query);
    let result = !!response.items ? response.items : [];
    while (!!response.has_more) {
        query.page += 1;
        let response = await api.get(path, query);
        result.concat(response.items)
    }
    return result;
}

joplin.plugins.register({
    onStart: async function () {
        console.info("Tags Generator plugin started");

        await joplin.commands.register({
            name: "GenerateTags",
            label: "Generate tags...",
            enabledCondition: "oneNoteSelected && noteIsMarkdown",
            execute: async () => {
                const selectedNoteIds = await joplin.workspace.selectedNoteIds();

                if (selectedNoteIds.length !== 1) {
                    throw "Generate tags only for one note";
                }

                const noteId = selectedNoteIds[0];

                if (selectedNoteIds.length === 1) {
                    const note = await joplin.data.get(['notes', noteId], {fields: ['id', 'title', 'body']});

                    if (
                        (await joplin.views.dialogs.showMessageBox(
                            `Generate tags for ${note["title"]} ?`
                        )) == 0
                    ) {
                        await joplin.commands.execute("showModalMessage", "Please wait, tags generation is in progress");

                        let allTags = await getAll(joplin.data, ['tags'], {fields: ['id', 'title'], page: 1});
                        const noteTags: string[] =
                            (await getAll(joplin.data, ['notes', noteId, 'tags'], {
                                fields: ['id'],
                                page: 1
                            })).map(t => t.id);

                        allTags = allTags.filter(t => !noteTags.includes(t.id));

                        unified()
                            .use(parse)
                            .use(strip)
                            .use(
                                remark2retext,
                                unified()
                                    .use(english)
                                    .use(pos) // Make sure to use `retext-pos` before `retext-keywords`.
                                    .use(keywords)
                            )
                            .use(stringify)
                            .process(note.body, async function (err, file) {
                                if (err) {
                                    console.error(err)
                                }

                                for (let i = 0; i < file.data["keywords"].length; i++) {
                                    const keyword = toString(file.data["keywords"][i].matches[0].node).toLowerCase();

                                    if (keyword.length > 2) {
                                        const tag = allTags.find(t => t.title.toLowerCase().startsWith(keyword));
                                        if (!tag) {
                                            const newTag = await joplin.data.post(['tags'], null, {
                                                title: keyword
                                            });
                                            await joplin.data.post(['tags', newTag.id, 'notes'], null, {
                                                id: noteId
                                            });
                                        } else {
                                            await joplin.data.post(['tags', tag.id, 'notes'], null, {
                                                id: noteId
                                            });
                                        }
                                    }
                                }
                            })

                        await joplin.commands.execute("hideModalMessage");
                    }
                }
            },
        });

        await joplin.views.menuItems.create(
            "myMenuItemToolsGenerateTags",
            "GenerateTags",
            MenuItemLocation.Tools
        );
        await joplin.views.menuItems.create(
            'contextMenuItemGenerateTags',
            'GenerateTags',
            MenuItemLocation.NoteListContextMenu
        );
    },
});