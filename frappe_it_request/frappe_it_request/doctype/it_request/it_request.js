// Copyright (c) 2025, AnyGridTech and contributors
// For license information, please see license.txt
"use strict";
(() => {
  // frappe_it_request/doctype/it_request/ts/it_request.ts
  var categories = {
    "System": {
      "Movidesk": [
        "Missing fields",
        "Webhook issue",
        "New module creation",
        "Advance Ticket",
        "Regress Ticket",
        "Field, Rule and/or Trigger",
        "Dashboard",
        "User",
        "Help Desk",
        "Ticket without date",
        "Macro",
        "Report",
        "Others"
      ],
      "ERPNext": [
        "User/Access",
        "Macro",
        "Automation",
        "Dashboard",
        "Script",
        "Advance Ticket/SN workflow",
        "Translation Improvement/Fix",
        "Permissions",
        "Field, Rule and/or Trigger",
        "Defective webhook",
        "System Test",
        "Help Desk",
        "Bug fixes (errors)",
        "Suggestions",
        "Implementations",
        "Knowledge Base",
        "Others"
      ],
      "API": [
        "Logistics API",
        "Tax API",
        "Movidesk API",
        "ERPNext API",
        "Others"
      ]
    },
    "Document": {
      "Editing": [
        "Spreadsheet (Google Sheets/Excel)",
        "Document (Google Docs/Word)",
        "Presentation (Google Slides/Power Point)",
        "Form (Google Forms)",
        "Spreadsheet and Form (Google Sheets and Google Forms)",
        "Automation/Code (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Others"
      ],
      "Creation": [
        "Spreadsheet (Google Sheets/Excel)",
        "Document (Google Docs/Word)",
        "Presentation (Google Slides/Power Point)",
        "Form (Google Forms)",
        "Spreadsheet and Form (Google Sheets and Google Forms)",
        "Automation/Code (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Others"
      ],
      "Maintenance": [
        "Spreadsheet (Google Sheets/Excel)",
        "Document (Google Docs/Word)",
        "Presentation (Google Slides/Power Point)",
        "Form (Google Forms)",
        "Spreadsheet and Form (Google Sheets and Google Forms)",
        "Automation/Code (Google Apps Script)",
        "Dashboard (Google Looker Studio)",
        "Others"
      ]
    },
    "Infrastructure (Equipment)": {
      "Office": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Notebook",
        "Mobile Phone",
        "Printer",
        "Cameras",
        "Peripherals",
        "Internet",
        "Others"
      ],
      "Warehouse": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Notebook",
        "Mobile Phone",
        "Printer",
        "Cameras",
        "Peripherals",
        "Internet",
        "Others"
      ],
      "Office and Warehouse": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Notebook",
        "Mobile Phone",
        "Printer",
        "Cameras",
        "Peripherals",
        "Internet",
        "Others"
      ]
    },
    "Infrastructure (Applications)": {
      "Office": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Others"
      ],
      "Warehouse": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Others"
      ],
      "Office and Warehouse": [
        "Windows",
        "Intelbras",
        "Feishu/Lark",
        "OA",
        "SAP",
        "Shinebus",
        "E-Mail",
        "Others"
      ]
    },
    "Human Resources": {
      "Office": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Others"
      ],
      "Warehouse": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Others"
      ],
      "Office and Warehouse": [
        "Onboarding Kit",
        "Offboarding Kit",
        "Others"
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
    frm.set_df_property("problem_description", "placeholder", __("Please write your request in detail."));
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
        console.error("Error fetching applicant's sector:", error);
        frappe.msgprint({
          title: __("Error"),
          message: __("Unable to retrieve the applicant's sector. Please select manually."),
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
      frm.set_df_property("problem_description", "placeholder", __("Please write your request in detail."));
      frm.set_df_property("resolution_deadline", "hidden", 0);
      if (!frappe.user.has_role(["Information Technology User", "Administrator", "System Manager"])) {
        frm.set_df_property("resolution_deadline", "read_only", 1);
        frm.fields_dict["resolution_deadline"]?.$wrapper?.on("click", function() {
          frappe.msgprint({
            title: __("Access Denied"),
            message: __("You do not have permission to edit the request resolution deadline."),
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
        if (frm.doc["workflow_state"] === "Pending") {
          frm.set_df_property("problem_description", "read_only", 0);
          frm.fields_dict["problem_description"]?.$wrapper?.off("click");
        } else {
          frm.set_df_property("problem_description", "read_only", 1);
          frm.fields_dict["problem_description"]?.$wrapper?.off("click").on("click", function() {
            frappe.msgprint({
              title: __("Access Denied"),
              message: __("You do not have permission to edit the request description. Contact the administrator."),
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
        console.error("agt.utils.form.adjust_html_elements is not available.");
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
          title: plural ? __("Required fields") : __("Required field"),
          message: `
                    <div>
                        ${plural ? __("The following fields are required and cannot be empty:") : __("The following field is required and cannot be empty:")}
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
          title: plural ? __("Required link fields") : __("Required link field"),
          message: `
                    <div>
                        ${plural ? __("The following link fields are required and cannot be empty:") : __("The following link field is required and cannot be empty:")}
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
    const isDocumentEditingOrMaintenance = frm.doc["first_category"] === "Document" && frm.doc["second_category"] === "Editing" || frm.doc["first_category"] === "Document" && frm.doc["second_category"] === "Maintenance";
    if (isDocumentEditingOrMaintenance) {
      frappe.utils.play_sound("alert");
      frappe.show_alert({
        message: __("Please include links related to document editing or maintenance."),
        indicator: "blue"
      }, 5);
    }
  }
})();
