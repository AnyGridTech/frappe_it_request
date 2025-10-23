"use strict";
const categories = {
    'Sistema': {
        'Movidesk': [
            'Campos desaparecidos',
            'Webhook com problema',
            'Criação de módulo novo',
            'Avançar Ticket',
            'Regredir Ticket',
            'Campo, Regra e/ou Gatilho',
            'Painel',
            'Usuário',
            'Help Desk',
            'Ticket sem data',
            'Macro',
            'Relatório',
            'Outros'
        ],
        'ERPNext': [
            'Usuário/Acessos',
            'Macro',
            'Automação',
            'Painel',
            'Script',
            'Permissões',
            'Campo, Regra e/ou Gatilho',
            'Webhook defeituoso',
            'Teste de Sistema',
            'Help Desk',
            'Correções de bugs (erros)',
            'Sugestões',
            'Implementações',
            'Base do Conhecimento',
            'Outros'
        ],
        'API': [
            'API Logística',
            'API Fiscal',
            'API Movidesk',
            'API ERPNext',
            'Outros'
        ]
    },
    'Documento': {
        'Edição': [
            'Planilha (Google Sheets/Excel)',
            'Documento (Google Docs/Word)',
            'Apresentação (Google Slides/Power Point)',
            'Formulário (Google Forms)',
            'Planilha e Formulário (Google Sheets e Google Forms)',
            'Automatização/Código (Google Apps Script)',
            'Dashboard (Google Looker Studio)',
            'Outros'
        ],
        'Criação': [
            'Planilha (Google Sheets/Excel)',
            'Documento (Google Docs/Word)',
            'Apresentação (Google Slides/Power Point)',
            'Formulário (Google Forms)',
            'Planilha e Formulário (Google Sheets e Google Forms)',
            'Automatização/Código (Google Apps Script)',
            'Dashboard (Google Looker Studio)',
            'Outros'
        ],
        'Manutenção': [
            'Planilha (Google Sheets/Excel)',
            'Documento (Google Docs/Word)',
            'Apresentação (Google Slides/Power Point)',
            'Formulário (Google Forms)',
            'Planilha e Formulário (Google Sheets e Google Forms)',
            'Automatização/Código (Google Apps Script)',
            'Dashboard (Google Looker Studio)',
            'Outros'
        ]
    },
    'Infraestrutura (Equipamentos)': {
        'Escritório': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Notebook',
            'Celular',
            'Impressora',
            'Câmeras',
            'Periféricos',
            'Internet',
            'Outros'
        ],
        'Galpão': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Notebook',
            'Celular',
            'Impressora',
            'Câmeras',
            'Periféricos',
            'Internet',
            'Outros'
        ],
        'Escritório e Galpão': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Notebook',
            'Celular',
            'Impressora',
            'Câmeras',
            'Periféricos',
            'Internet',
            'Outros'
        ]
    },
    'Infraestrutura (Aplicações)': {
        'Escritório': [
            'Windows',
            'Intelbras',
            'Feishu/Lark',
            'OA',
            'SAP',
            'Shinebus',
            'E-Mail',
            'Outros'
        ],
        'Galpão': [
            'Windows',
            'Intelbras',
            'Feishu/Lark',
            'OA',
            'SAP',
            'Shinebus',
            'E-Mail',
            'Outros'
        ],
        'Escritório e Galpão': [
            'Windows',
            'Intelbras',
            'Feishu/Lark',
            'OA',
            'SAP',
            'Shinebus',
            'E-Mail',
            'Outros'
        ]
    },
    'Recursos Humanos': {
        'Escritório': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Outros'
        ],
        'Galpão': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Outros'
        ],
        'Escritório e Galpão': [
            'Kit Onboarding',
            'Kit Offboarding',
            'Outros'
        ]
    }
};
function setOptions(frm, fieldName, options) {
    let effectiveOptions = options || [];
    const currentVal = frm.doc[fieldName];
    if (currentVal && !effectiveOptions.includes(currentVal)) {
        effectiveOptions.unshift(currentVal);
    }
    frm.set_df_property(fieldName, 'options', ["", ...effectiveOptions]);
}
function clearSubsequentCategories(frm, level) {
    switch (level) {
        case 1:
            frm.set_value('second_category', null);
            frm.set_value('third_category', null);
            break;
        case 2:
            frm.set_value('third_category', null);
            break;
    }
}
function updateOptions(frm, categoryLevel) {
    let options;
    const firstCat = frm.doc['first_category'];
    const secondCat = frm.doc['second_category'];
    switch (categoryLevel) {
        case 1:
            options = Object.keys(categories);
            setOptions(frm, 'first_category', options);
            break;
        case 2:
            if (firstCat && categories[firstCat]) {
                options = Object.keys(categories[firstCat]);
            }
            else {
                options = [];
            }
            setOptions(frm, 'second_category', options);
            break;
        case 3:
            if (firstCat && secondCat &&
                categories[firstCat] && categories[firstCat][secondCat]) {
                options = categories[firstCat][secondCat];
            }
            else {
                options = [];
            }
            setOptions(frm, 'third_category', options);
            break;
    }
}
async function initializeForm(frm) {
    if (!frm.doc['applicant']) {
        frm.set_value("applicant", frappe.session.user);
    }
    if (frm.doc['applicant']) {
        try {
            const r = await frappe.db.get_value('User', frm.doc['applicant'], 'internal_department');
            if (r && r.message && r.message.internal_department) {
                frm.set_value("sector_applicant", r.message.internal_department);
                frm.refresh_field('sector_applicant');
            }
            else {
                frm.set_value("sector_applicant", null);
                frm.refresh_field('sector_applicant');
            }
        }
        catch (error) {
            console.error("Erro ao buscar setor do solicitante:", error);
            frappe.msgprint({
                title: ('Erro'),
                message: ('Não foi possível obter o setor do solicitante. Por favor, selecione manualmente.'),
                indicator: 'red'
            });
        }
    }
    updateOptions(frm, 1);
    updateOptions(frm, 2);
    updateOptions(frm, 3);
    frm.refresh_field('first_category');
    frm.refresh_field('second_category');
    frm.refresh_field('third_category');
}
frappe.ui.form.on('IT Request', {
    setup(frm) {
        ['sector_applicant', 'employee_sector'].forEach(field => {
            frm.set_query(field, () => {
                return {
                    filters: {
                        name: ['in', [
                                'Administrativo',
                                'Estoque',
                                'Engenharia',
                                'Fiscal',
                                'Laboratório de Placas',
                                'Laboratório de Reparos',
                                'Logística',
                                'Marketing',
                                'Operações',
                                'Recursos Humanos',
                                'Suporte ao Cliente',
                                'Suporte Técnico',
                                'T.I'
                            ]]
                    }
                };
            });
        });
    },
    applicant: async (frm) => {
        await initializeForm(frm);
    },
    refresh: async function (frm) {
        await initializeForm(frm);
        frm.set_df_property('resolution_deadline', 'hidden', 0);
        if (!frappe.user.has_role(['Information Technology User', 'Administrator', 'System Manager'])) {
            frm.set_df_property('resolution_deadline', 'read_only', 1);
            frm.fields_dict['resolution_deadline']?.$wrapper?.on('click', function () {
                frappe.msgprint({
                    title: ('Acesso Negado'),
                    message: ('Você não tem permissão para editar o prazo de resolução do chamado.'),
                    indicator: 'red'
                });
            });
        }
        else {
            frm.set_df_property('resolution_deadline', 'read_only', 0);
            frm.fields_dict['resolution_deadline']?.$wrapper?.off('click');
        }
        frm.set_df_property('problem_description', 'hidden', 0);
        if (frappe.user.has_role(['Information Technology User', 'Administrator', 'System Manager'])) {
            frm.set_df_property('problem_description', 'read_only', 0);
            frm.fields_dict['problem_description']?.$wrapper?.off('click');
        }
        else {
            if (frm.doc['workflow_state'] === "Pendente") {
                frm.set_df_property('problem_description', 'read_only', 0);
                frm.fields_dict['problem_description']?.$wrapper?.off('click');
            }
            else {
                frm.set_df_property('problem_description', 'read_only', 1);
                frm.fields_dict['problem_description']?.$wrapper?.off('click').on('click', function () {
                    frappe.msgprint({
                        title: ('Acesso Negado'),
                        message: ('Você não tem permissão para editar a descrição do chamado. Contate o administrador.'),
                        indicator: 'red'
                    });
                });
            }
        }
        const allowedUsers = frappe.user.has_role('Information Technology User') ||
            frappe.user.has_role('System Manager') ||
            frappe.user.has_role('Administrator');
        const options = {
            removeTabs: true,
            removeSidebar: !allowedUsers,
            removeAssignments: false,
            removeAssignmentsButton: false,
            removeAttachments: false,
            removeAttachmentsButton: false,
            removeShared: false,
            removeTags: false,
            removeSidebarStats: false,
            removeSidebarMenu: false,
            removeSidebarReset: false,
            removeSidebarToggle: false,
        };
        if (agt?.utils?.form?.adjust_html_elements) {
            agt.utils.form.adjust_html_elements(frm, options);
        }
        else {
            console.error('agt.utils.form.adjust_html_elements não está disponível.');
        }
    },
    first_category(frm) {
        clearSubsequentCategories(frm, 1);
        updateOptions(frm, 2);
        updateOptions(frm, 3);
        frm.refresh_field('second_category');
        frm.refresh_field('third_category');
        checkDocumentEditingOrMaintenance(frm);
    },
    second_category(frm) {
        clearSubsequentCategories(frm, 2);
        updateOptions(frm, 3);
        frm.refresh_field('third_category');
        checkDocumentEditingOrMaintenance(frm);
    },
    onload: async (frm) => {
        await initializeForm(frm);
    },
    validate: function (frm) {
        const linkFields = Object.keys(frm.doc).filter((field) => field.startsWith('link_'));
        const invalidLinks = [];
        const emptyLinkFields = [];
        const emptyRequiredFields = [];
        const urlRegex = /^https?:\/\/(?:www\.)?[\w\-\.]+(?:\.[a-zA-Z]{2,})+(?:\/[\w\-\._~:\/?#\[\]@!$&'()*+,;=%]*)?$/i;
        linkFields.forEach((field) => {
            const value = frm.doc[field] ? frm.doc[field].trim() : "";
            const label = frappe.meta.get_docfield(frm.doctype, field, frm.doc.name)?.label || field;
            if (!value) {
                emptyLinkFields.push(label);
                return;
            }
            let links = [];
            const urlMatches = value.match(/https?:\/\/[^\s,]+/g);
            if (urlMatches) {
                links.push(...urlMatches);
            }
            if (links.length === 0) {
                const separatedLinks = value.split(/[\n\s,]+/).map((link) => link.trim()).filter((link) => link);
                links.push(...separatedLinks);
            }
            links = [...new Set(links)];
            if (links.length === 0 && value) {
                links = [value];
            }
            links.forEach((link) => {
                if (link && !urlRegex.test(link)) {
                    invalidLinks.push(link);
                }
            });
        });
        frm.meta.fields.forEach((field) => {
            if (field.reqd) {
                const value = frm.doc[field.fieldname];
                if (value === undefined ||
                    value === null ||
                    (typeof value === 'string' && value.trim() === '')) {
                    emptyRequiredFields.push(field.label);
                }
            }
        });
        if (emptyRequiredFields.length > 0) {
            frappe.utils.play_sound("error");
            const plural = emptyRequiredFields.length > 1;
            frappe.throw({
                title: plural ? 'Campos obrigatórios' : 'Campo obrigatório',
                message: `
                    <div>
                        ${plural ? 'Os seguintes campos são obrigatórios e não podem estar vazios:'
                    : 'O seguinte campo é obrigatório e não pode estar vazio:'}
                        <br><br>
                        <ul>
                            ${emptyRequiredFields.map(field => `<li>${field}</li>`).join('')}
                        </ul>
                    </div>`,
                indicator: 'red'
            });
        }
        if (emptyLinkFields.length > 0) {
            frappe.utils.play_sound("error");
            const plural = emptyLinkFields.length > 1;
            frappe.throw({
                title: plural ? 'Campos de link obrigatórios' : 'Campo de link obrigatório',
                message: `
                    <div>
                        ${plural ? 'Os seguintes campos de link são obrigatórios e não podem estar vazios:'
                    : 'O seguinte campo de link é obrigatório e não pode estar vazio:'}
                        <br><br>
                        <ul>
                            ${emptyLinkFields.map(field => `<li>${field}</li>`).join('')}
                        </ul>
                    </div>`,
                indicator: 'red'
            });
        }
    }
});
function checkDocumentEditingOrMaintenance(frm) {
    const isDocumentEditingOrMaintenance = (frm.doc['first_category'] === "Documento" && frm.doc['second_category'] === "Edição") ||
        (frm.doc['first_category'] === "Documento" && frm.doc['second_category'] === "Manutenção");
    if (isDocumentEditingOrMaintenance) {
        frappe.utils.play_sound("alert");
        frappe.show_alert({
            message: ('Por favor, inclua links relacionados à edição ou manutenção de documentos.'),
            indicator: 'blue'
        }, 5);
    }
}
//# sourceMappingURL=frappe_it_request.js.map