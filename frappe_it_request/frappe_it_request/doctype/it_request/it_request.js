// Copyright (c) 2025, AnyGridTech and contributors
// For license information, please see license.txt
"use strict";
(() => {
  // frappe_it_request/doctype/it_request/ts/it_request.ts
  var categories = {
    "Sistema": {
      "Movidesk": [
        "Campos desaparecidos",
        "Webhook com problema",
        "Cria\xE7\xE3o de m\xF3dulo novo",
        "Avan\xE7ar Ticket",
        "Regredir Ticket",
        "Campo, Regra e/ou Gatilho",
        "Painel",
        "Usu\xE1rio",
        "Help Desk",
        "Ticket sem data",
        "Macro",
        "Relat\xF3rio",
        "Outros"
      ],
      "ERPNext": [
        "Usu\xE1rio/Acessos",
        "Macro",
        "Automa\xE7\xE3o",
        "Painel",
        "Script",
        "Permiss\xF5es",
        "Campo, Regra e/ou Gatilho",
        "Webhook defeituoso",
        "Teste de Sistema",
        "Help Desk",
        "Corre\xE7\xF5es de bugs (erros)",
        "Sugest\xF5es",
        "Implementa\xE7\xF5es",
        "Base do Conhecimento",
        "Outros"
      ],
      "API": [
        "API Log\xEDstica",
        "API Fiscal",
        "API Movidesk",
        "API ERPNext",
        "Outros"
      ]
    },
    "Documento": {
      "Edi\xE7\xE3o": [
        "Planilha (Google Sheets/Excel)",
        "Documento (Google Docs/Word)",
        "Apresenta\xE7\xE3o (Google Slides/Power Point)",
        "Formul\xE1rio (Google Forms)",
        "Planilha e Formul\xE1rio (Google Sheets e Google Forms)",
        "Automatiza\xE7\xE3o/C\xF3digo (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Outros"
      ],
      "Cria\xE7\xE3o": [
        "Planilha (Google Sheets/Excel)",
        "Documento (Google Docs/Word)",
        "Apresenta\xE7\xE3o (Google Slides/Power Point)",
        "Formul\xE1rio (Google Forms)",
        "Planilha e Formul\xE1rio (Google Sheets e Google Forms)",
        "Automatiza\xE7\xE3o/C\xF3digo (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Outros"
      ],
      "Manuten\xE7\xE3o": [
        "Planilha (Google Sheets/Excel)",
        "Documento (Google Docs/Word)",
        "Apresenta\xE7\xE3o (Google Slides/Power Point)",
        "Formul\xE1rio (Google Forms)",
        "Planilha e Formul\xE1rio (Google Sheets e Google Forms)",
        "Automatiza\xE7\xE3o/C\xF3digo (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Outros"
      ]
    },
    "Infraestrutura (Equipamentos)": {
      "Escrit\xF3rio": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Notebook",
        "Celular",
        "Impressora",
        "C\xE2meras",
        "Perif\xE9ricos",
        "Internet",
        "Outros"
      ],
      "Galp\xE3o": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Notebook",
        "Celular",
        "Impressora",
        "C\xE2meras",
        "Perif\xE9ricos",
        "Internet",
        "Outros"
      ],
      "Escrit\xF3rio e Galp\xE3o": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Notebook",
        "Celular",
        "Impressora",
        "C\xE2meras",
        "Perif\xE9ricos",
        "Internet",
        "Outros"
      ]
    },
    "Infraestrutura (Aplica\xE7\xF5es)": {
      "Escrit\xF3rio": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Outros"
      ],
      "Galp\xE3o": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Outros"
      ],
      "Escrit\xF3rio e Galp\xE3o": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Outros"
      ]
    },
    "Recursos Humanos": {
      "Escrit\xF3rio": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Outros"
      ],
      "Galp\xE3o": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Outros"
      ],
      "Escrit\xF3rio e Galp\xE3o": [
        "Kit Onboarding",
        "Kit Offboarding",
        "Outros"
      ]
    }
  };
  function setOptions(frm, fieldName, options) {
    let effectiveOptions = options || [];
    const currentVal = frm.doc[fieldName];
    if (currentVal && !effectiveOptions.includes(currentVal)) {
      effectiveOptions.unshift(currentVal);
    }
    frm.set_df_property(fieldName, "options", ["", ...effectiveOptions]);
  }
  function clearSubsequentCategories(frm, level) {
    switch (level) {
      case 1:
        frm.set_value("second_category", null);
        frm.set_value("third_category", null);
        break;
      case 2:
        frm.set_value("third_category", null);
        break;
    }
  }
  function updateOptions(frm, categoryLevel) {
    let options;
    const firstCat = frm.doc["first_category"];
    const secondCat = frm.doc["second_category"];
    switch (categoryLevel) {
      case 1:
        options = Object.keys(categories);
        setOptions(frm, "first_category", options);
        break;
      case 2:
        if (firstCat && categories[firstCat]) {
          options = Object.keys(categories[firstCat]);
        } else {
          options = [];
        }
        setOptions(frm, "second_category", options);
        break;
      case 3:
        if (firstCat && secondCat && categories[firstCat] && categories[firstCat][secondCat]) {
          options = categories[firstCat][secondCat];
        } else {
          options = [];
        }
        setOptions(frm, "third_category", options);
        break;
    }
  }
  async function initializeForm(frm) {
    if (!frm.doc["applicant"]) {
      frm.set_value("applicant", frappe.session.user);
    }
    if (frm.doc["applicant"]) {
      try {
        const r = await frappe.db.get_value("User", frm.doc["applicant"], "internal_department");
        if (r && r.message && r.message.internal_department) {
          frm.set_value("sector_applicant", r.message.internal_department);
          frm.refresh_field("sector_applicant");
        } else {
          frm.set_value("sector_applicant", null);
          frm.refresh_field("sector_applicant");
        }
      } catch (error) {
        console.error("Erro ao buscar setor do solicitante:", error);
        frappe.msgprint({
          title: "Erro",
          message: "N\xE3o foi poss\xEDvel obter o setor do solicitante. Por favor, selecione manualmente.",
          indicator: "red"
        });
      }
    }
    updateOptions(frm, 1);
    updateOptions(frm, 2);
    updateOptions(frm, 3);
    frm.refresh_field("first_category");
    frm.refresh_field("second_category");
    frm.refresh_field("third_category");
  }
  frappe.ui.form.on("IT Request", {
    setup(frm) {
      ["sector_applicant", "employee_sector"].forEach((field) => {
        frm.set_query(field, () => {
          return {
            filters: {
              name: ["in", [
                "Administrativo",
                "Estoque",
                "Engenharia",
                "Fiscal",
                "Laborat\xF3rio de Placas",
                "Laborat\xF3rio de Reparos",
                "Log\xEDstica",
                "Marketing",
                "Opera\xE7\xF5es",
                "Recursos Humanos",
                "Suporte ao Cliente",
                "Suporte T\xE9cnico",
                "T.I"
              ]]
            }
          };
        });
      });
    },
    applicant: async (frm) => {
      await initializeForm(frm);
    },
    refresh: async function(frm) {
      await initializeForm(frm);
      frm.set_df_property("resolution_deadline", "hidden", 0);
      if (!frappe.user.has_role(["Information Technology User", "Administrator", "System Manager"])) {
        frm.set_df_property("resolution_deadline", "read_only", 1);
        frm.fields_dict["resolution_deadline"]?.$wrapper?.on("click", function() {
          frappe.msgprint({
            title: "Acesso Negado",
            message: "Voc\xEA n\xE3o tem permiss\xE3o para editar o prazo de resolu\xE7\xE3o do chamado.",
            indicator: "red"
          });
        });
      } else {
        frm.set_df_property("resolution_deadline", "read_only", 0);
        frm.fields_dict["resolution_deadline"]?.$wrapper?.off("click");
      }
      frm.set_df_property("problem_description", "hidden", 0);
      if (frappe.user.has_role(["Information Technology User", "Administrator", "System Manager"])) {
        frm.set_df_property("problem_description", "read_only", 0);
        frm.fields_dict["problem_description"]?.$wrapper?.off("click");
      } else {
        if (frm.doc["workflow_state"] === "Pendente") {
          frm.set_df_property("problem_description", "read_only", 0);
          frm.fields_dict["problem_description"]?.$wrapper?.off("click");
        } else {
          frm.set_df_property("problem_description", "read_only", 1);
          frm.fields_dict["problem_description"]?.$wrapper?.off("click").on("click", function() {
            frappe.msgprint({
              title: "Acesso Negado",
              message: "Voc\xEA n\xE3o tem permiss\xE3o para editar a descri\xE7\xE3o do chamado. Contate o administrador.",
              indicator: "red"
            });
          });
        }
      }
      const allowedUsers = frappe.user.has_role("Information Technology User") || frappe.user.has_role("System Manager") || frappe.user.has_role("Administrator");
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
        removeSidebarToggle: false
      };
      if (agt?.utils?.form?.adjust_html_elements) {
        agt.utils.form.adjust_html_elements(frm, options);
      } else {
        console.error("agt.utils.form.adjust_html_elements n\xE3o est\xE1 dispon\xEDvel.");
      }
    },
    first_category(frm) {
      clearSubsequentCategories(frm, 1);
      updateOptions(frm, 2);
      updateOptions(frm, 3);
      frm.refresh_field("second_category");
      frm.refresh_field("third_category");
      checkDocumentEditingOrMaintenance(frm);
    },
    second_category(frm) {
      clearSubsequentCategories(frm, 2);
      updateOptions(frm, 3);
      frm.refresh_field("third_category");
      checkDocumentEditingOrMaintenance(frm);
    },
    onload: async (frm) => {
      await initializeForm(frm);
    },
    validate: function(frm) {
      const linkFields = Object.keys(frm.doc).filter((field) => field.startsWith("link_"));
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
          if (value === void 0 || value === null || typeof value === "string" && value.trim() === "") {
            emptyRequiredFields.push(field.label);
          }
        }
      });
      if (emptyRequiredFields.length > 0) {
        frappe.utils.play_sound("error");
        const plural = emptyRequiredFields.length > 1;
        frappe.throw({
          title: plural ? "Campos obrigat\xF3rios" : "Campo obrigat\xF3rio",
          message: `
                    <div>
                        ${plural ? "Os seguintes campos s\xE3o obrigat\xF3rios e n\xE3o podem estar vazios:" : "O seguinte campo \xE9 obrigat\xF3rio e n\xE3o pode estar vazio:"}
                        <br><br>
                        <ul>
                            ${emptyRequiredFields.map((field) => `<li>${field}</li>`).join("")}
                        </ul>
                    </div>`,
          indicator: "red"
        });
      }
      if (emptyLinkFields.length > 0) {
        frappe.utils.play_sound("error");
        const plural = emptyLinkFields.length > 1;
        frappe.throw({
          title: plural ? "Campos de link obrigat\xF3rios" : "Campo de link obrigat\xF3rio",
          message: `
                    <div>
                        ${plural ? "Os seguintes campos de link s\xE3o obrigat\xF3rios e n\xE3o podem estar vazios:" : "O seguinte campo de link \xE9 obrigat\xF3rio e n\xE3o pode estar vazio:"}
                        <br><br>
                        <ul>
                            ${emptyLinkFields.map((field) => `<li>${field}</li>`).join("")}
                        </ul>
                    </div>`,
          indicator: "red"
        });
      }
    }
  });
  function checkDocumentEditingOrMaintenance(frm) {
    const isDocumentEditingOrMaintenance = frm.doc["first_category"] === "Documento" && frm.doc["second_category"] === "Edi\xE7\xE3o" || frm.doc["first_category"] === "Documento" && frm.doc["second_category"] === "Manuten\xE7\xE3o";
    if (isDocumentEditingOrMaintenance) {
      frappe.utils.play_sound("alert");
      frappe.show_alert({
        message: "Por favor, inclua links relacionados \xE0 edi\xE7\xE3o ou manuten\xE7\xE3o de documentos.",
        indicator: "blue"
      }, 5);
    }
  }
})();
