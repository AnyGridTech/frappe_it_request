"use strict"
import { FrappeForm } from "@anygridtech/frappe-types/client/frappe/core";
import type { ITRequestCategories } from "./types/frappe_it_request";

/**
 * A hierarchical record representing IT request categories and their subcategories.
 *
 * The structure is organized as follows:
 * - Top-level keys represent main categories (e.g., "Sistema", "Documento", "Infraestrutura (Equipamentos)", etc.).
 * - Each main category contains subcategories (e.g., "Movidesk", "ERPNext", "Edição", "Criação", "Escritório", "Galpão", etc.).
 * - Each subcategory is an array of strings, each string describing a specific type of request or item.
 *
 * This structure is intended for use in forms, dropdowns, or logic that requires categorization of IT-related requests.
 *
 * Example usage:
 * ```typescript
 * const sistemas = categories['Sistema'];
 * const movideskOptions = sistemas['Movidesk'];
 * ```
 */


const categories: ITRequestCategories = {
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

function setOptions(frm: FrappeForm, fieldName: string, options: string[] | undefined): void {
  let effectiveOptions = options || []; // Garante que seja um array
  // let newOptions = [""]; // Mantendo a lógica original, mesmo que newOptions não seja explicitamente usada depois

  const currentVal = frm.doc[fieldName];
  // Mantendo a lógica original de adicionar o valor atual no início se ele não estiver na lista
  if (currentVal && !effectiveOptions.includes(currentVal)) {
    // O método unshift modifica o array original, como no JS
    effectiveOptions.unshift(currentVal);
  }

  // Assumindo que a intenção era sempre ter a opção em branco:
  frm.set_df_property(fieldName, 'options', ["", ...effectiveOptions]);
}

function clearSubsequentCategories(frm: FrappeForm, level: number): void {
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

function updateOptions(frm: FrappeForm, categoryLevel: number): void {
  let options: string[] | undefined;
  const firstCat = frm.doc['first_category'] as string;
  const secondCat = frm.doc['second_category'] as string;
  switch (categoryLevel) {
    case 1:
      options = Object.keys(categories);
      setOptions(frm, 'first_category', options);
      break;
    case 2:
      if (firstCat && categories[firstCat]) {
        options = Object.keys(categories[firstCat]);
      } else {
        options = [];
      }
      setOptions(frm, 'second_category', options);
      break;
    case 3:
      if (firstCat && secondCat &&
        categories[firstCat] && categories[firstCat][secondCat]) {
        options = categories[firstCat][secondCat] as string[];
      } else {
        options = [];
      }
      setOptions(frm, 'third_category', options);
      break;
  }
}

async function initializeForm(frm: FrappeForm): Promise<void> {
  if (!frm.doc['applicant']) {
    frm.set_value("applicant", frappe.session.user as string);
  }
  // Sempre buscar o setor do solicitante quando a função for chamada
  // Isso garantirá que o setor seja atualizado quando o solicitante mudar
  if (frm.doc['applicant']) {
    try {
      const r = await frappe.db.get_value('User', frm.doc['applicant'], 'internal_department');
      if (r && r.message && r.message.internal_department) {
        frm.set_value("sector_applicant", r.message.internal_department);
        frm.refresh_field('sector_applicant');
      } else {
        // Limpa o campo se não encontrar um departamento
        frm.set_value("sector_applicant", null);
        frm.refresh_field('sector_applicant');
      }
    } catch (error) {
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
  setup(frm: FrappeForm) {
    // Limit sector_applicant and employee_sector fields
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
  
  applicant: async (frm: FrappeForm) => {
    await initializeForm(frm);
  },
  
  refresh: async function (frm: FrappeForm) {
    // Inicializar formulário
    await initializeForm(frm);
    
    // Código responsável por bloquear a edição do campo "resolution_deadline"
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
    } else {
      frm.set_df_property('resolution_deadline', 'read_only', 0);
      frm.fields_dict['resolution_deadline']?.$wrapper?.off('click');
    }
    
    // Código do campo de 'problem_description'
    frm.set_df_property('problem_description', 'hidden', 0);
    
    if (frappe.user.has_role(['Information Technology User', 'Administrator', 'System Manager'])) {
      frm.set_df_property('problem_description', 'read_only', 0);
      frm.fields_dict['problem_description']?.$wrapper?.off('click');
    } else {
      if (frm.doc['workflow_state'] === "Pendente") {
        frm.set_df_property('problem_description', 'read_only', 0);
        frm.fields_dict['problem_description']?.$wrapper?.off('click');
      } else {
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
    
    // Ajustes de elementos HTML do formulário
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
    } else {
      console.error('agt.utils.form.adjust_html_elements não está disponível.');
    }
  },

  first_category(frm: FrappeForm) {
    clearSubsequentCategories(frm, 1);
    updateOptions(frm, 2);
    updateOptions(frm, 3);
    frm.refresh_field('second_category');
    frm.refresh_field('third_category');
    checkDocumentEditingOrMaintenance(frm);
  },

  second_category(frm: FrappeForm) {
    clearSubsequentCategories(frm, 2);
    updateOptions(frm, 3);
    frm.refresh_field('third_category');
    checkDocumentEditingOrMaintenance(frm);
  },
  
  onload: async (frm: FrappeForm) => {
    await initializeForm(frm);
  },
  
  validate: function (frm: FrappeForm) {
    const linkFields: string[] = Object.keys(frm.doc).filter((field: string) => field.startsWith('link_'));
    const invalidLinks: string[] = [];
    const emptyLinkFields: string[] = [];
    const emptyRequiredFields: string[] = [];
    // Regex mais flexível para aceitar URLs complexas do Google e outros serviços
    const urlRegex = /^https?:\/\/(?:www\.)?[\w\-\.]+(?:\.[a-zA-Z]{2,})+(?:\/[\w\-\._~:\/?#\[\]@!$&'()*+,;=%]*)?$/i;

    // Check link_ fields
    linkFields.forEach((field: string) => {
      const value: string = frm.doc[field] ? frm.doc[field].trim() : "";
      // @ts-ignore - frappe.meta exists at runtime
      const label = frappe.meta.get_docfield(frm.doctype, field, frm.doc.name)?.label || field;

      if (!value) {
        emptyLinkFields.push(label);
        return;
      }

      // Extract links using multiple strategies
      let links: string[] = [];

      // Strategy 1: Extract URLs using regex first (mais preciso)
      const urlMatches = value.match(/https?:\/\/[^\s,]+/g);
      if (urlMatches) {
        links.push(...urlMatches);
      }

      // Strategy 2: If no URLs found, try splitting by separators
      if (links.length === 0) {
        const separatedLinks = value.split(/[\n\s,]+/).map((link: string) => link.trim()).filter((link: string) => link);
        links.push(...separatedLinks);
      }

      // Remove duplicates
      links = [...new Set(links)];

      // If no links were found but value exists, treat the whole value as a potential link
      if (links.length === 0 && value) {
        links = [value];
      }

      links.forEach((link: string) => {
        if (link && !urlRegex.test(link)) {
          invalidLinks.push(link);
        }
      });
    });

    // Check required fields
    frm.meta.fields.forEach((field) => {
      if (field.reqd) {
        const value = frm.doc[field.fieldname];
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          emptyRequiredFields.push(field.label);
        }
      }
    });

    // Prepare and throw errors for empty required fields
    if (emptyRequiredFields.length > 0) {
      frappe.utils.play_sound("error"); // Some cool sound effect to get the user's attention

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

    // Prepare and throw errors for empty link fields
    if (emptyLinkFields.length > 0) {
      frappe.utils.play_sound("error"); // Some cool sound effect to get the user's attention

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

    // Prepare and throw errors for invalid links
    // if (invalidLinks.length > 0) {
    //   frappe.utils.play_sound("error"); // Some cool sound effect to get the user's attention

    //   const plural = invalidLinks.length > 1;
    //   frappe.throw({
    //     title: plural ? 'Links inválidos' : 'Link inválido',
    //     message: `
    //                 <div>
    //                     ${plural ? 'Os seguintes links não são válidos:'
    //         : 'O seguinte link não é válido:'}
    //                     <br><br>
    //                     <ul>
    //                         ${invalidLinks.map(link => `<li>${link}</li>`).join('')}
    //                     </ul>
    //                 </div>`,
    //     indicator: 'red'
    //   });
    // }
  }
});

function checkDocumentEditingOrMaintenance(frm: FrappeForm): void {
  const isDocumentEditingOrMaintenance =
    (frm.doc['first_category'] === "Documento" && frm.doc['second_category'] === "Edição") ||
    (frm.doc['first_category'] === "Documento" && frm.doc['second_category'] === "Manutenção");

  if (isDocumentEditingOrMaintenance) {
    frappe.utils.play_sound("alert"); // Some cool sound effect to get the user's attention
    frappe.show_alert({
      message: ('Por favor, inclua links relacionados à edição ou manutenção de documentos.'),
      indicator: 'blue'
    }, 5);
  }
}