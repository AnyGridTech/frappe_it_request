"use strict"
import { FrappeForm } from "@anygridtech/frappe-types/client/frappe/core";
import type { ITRequestCategories } from "./types/it_request";

/**
 * A hierarchical record representing IT request categories and their subcategories.
 *
 * The structure is organized as follows:
 * - Top-level keys represent main categories (e.g., "System", "Document", "Infrastructure (Equipment)", etc.).
 * - Each main category contains subcategories (e.g., "Movidesk", "ERPNext", "Editing", "Creation", "Office", "Warehouse", etc.).
 * - Each subcategory is an array of strings, each string describing a specific type of request or item.
 *
 * This structure is intended for use in forms, dropdowns, or logic that requires categorization of IT-related requests.
 *
 * Example usage:
 * ```typescript
 * const systems = categories['System'];
 * const movideskOptions = systems['Movidesk'];
 * ```
 */

const categories: ITRequestCategories = {
  'System': {
    'Movidesk': [
      'Missing fields',
      'Webhook issue',
      'New module creation',
      'Advance Ticket',
      'Regress Ticket',
      'Field, Rule and/or Trigger',
      'Dashboard',
      'User',
      'Help Desk',
      'Ticket without date',
      'Macro',
      'Report',
      'Others'
    ],
    'ERPNext': [
      'User/Access',
      'Macro',
      'Automation',
      'Dashboard',
      'Script',
      'Permissions',
      'Field, Rule and/or Trigger',
      'Defective webhook',
      'System Test',
      'Help Desk',
      'Bug fixes (errors)',
      'Suggestions',
      'Implementations',
      'Knowledge Base',
      'Others'
    ],
    'API': [
      'Logistics API',
      'Tax API',
      'Movidesk API',
      'ERPNext API',
      'Others'
    ]
  },
  'Document': {
    'Editing': [
      'Spreadsheet (Google Sheets/Excel)',
      'Document (Google Docs/Word)',
      'Presentation (Google Slides/Power Point)',
      'Form (Google Forms)',
      'Spreadsheet and Form (Google Sheets and Google Forms)',
      'Automation/Code (Google Apps Script)',
      'Dashboard (Google Looker Studio)',
      'Others'
    ],
    'Creation': [
      'Spreadsheet (Google Sheets/Excel)',
      'Document (Google Docs/Word)',
      'Presentation (Google Slides/Power Point)',
      'Form (Google Forms)',
      'Spreadsheet and Form (Google Sheets and Google Forms)',
      'Automation/Code (Google Apps Script)',
      'Dashboard (Google Looker Studio)',
      'Others'
    ],
    'Maintenance': [
      'Spreadsheet (Google Sheets/Excel)',
      'Document (Google Docs/Word)',
      'Presentation (Google Slides/Power Point)',
      'Form (Google Forms)',
      'Spreadsheet and Form (Google Sheets and Google Forms)',
      'Automation/Code (Google Apps Script)',
      'Dashboard (Google Looker Studio)',
      'Others'
    ]
  },
  'Infrastructure (Equipment)': {
    'Office': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Notebook',
      'Mobile Phone',
      'Printer',
      'Cameras',
      'Peripherals',
      'Internet',
      'Others'
    ],
    'Warehouse': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Notebook',
      'Mobile Phone',
      'Printer',
      'Cameras',
      'Peripherals',
      'Internet',
      'Others'
    ],
    'Office and Warehouse': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Notebook',
      'Mobile Phone',
      'Printer',
      'Cameras',
      'Peripherals',
      'Internet',
      'Others'
    ]
  },
  'Infrastructure (Applications)': {
    'Office': [
      'Windows',
      'Intelbras',
      'Feishu/Lark',
      'OA',
      'SAP',
      'Shinebus',
      'E-Mail',
      'Others'
    ],
    'Warehouse': [
      'Windows',
      'Intelbras',
      'Feishu/Lark',
      'OA',
      'SAP',
      'Shinebus',
      'E-Mail',
      'Others'
    ],
    'Office and Warehouse': [
      'Windows',
      'Intelbras',
      'Feishu/Lark',
      'OA',
      'SAP',
      'Shinebus',
      'E-Mail',
      'Others'
    ]
  },
  'Human Resources': {
    'Office': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Others'
    ],
    'Warehouse': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Others'
    ],
    'Office and Warehouse': [
      'Onboarding Kit',
      'Offboarding Kit',
      'Others'
    ]
  }
};

function setOptions(frm: FrappeForm, fieldName: string, options: string[] | undefined): void {
  let effectiveOptions = options || []; // Ensures it's an array
  // let newOptions = [""]; // Keeping the original logic, even though newOptions is not explicitly used afterwards

  const currentVal = frm.doc[fieldName];
  // Keeping the original logic of adding the current value at the beginning if it's not in the list
  if (currentVal && !effectiveOptions.includes(currentVal)) {
    // The unshift method modifies the original array, as in JS
    effectiveOptions.unshift(currentVal);
  }

  // Assuming the intention was always to have a blank option:
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
  frm.set_df_property('problem_description', 'placeholder', __('Please write your request in detail.'));
}

async function initializeForm(frm: FrappeForm): Promise<void> {
  if (!frm.doc['applicant']) {
    frm.set_value("applicant", frappe.session.user as string);
  }
  // Always fetch the applicant's sector when the function is called
  // This will ensure the sector is updated when the applicant changes
  if (frm.doc['applicant']) {
    try {
      const r = await frappe.db.get_value('User', frm.doc['applicant'], 'internal_department');
      if (r && r.message && r.message.internal_department) {
        frm.set_value("sector_applicant", r.message.internal_department);
        frm.refresh_field('sector_applicant');
      } else {
        // Clear the field if no department is found
        frm.set_value("sector_applicant", null);
        frm.refresh_field('sector_applicant');
      }
    } catch (error) {
      console.error("Error fetching applicant's sector:", error);
      frappe.msgprint({
        title: __('Error'),
        message: __('Unable to retrieve the applicant\'s sector. Please select manually.'),
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
    // Initialize form
    await initializeForm(frm);

    // Set translated placeholder for problem_description field
    frm.set_df_property('problem_description', 'placeholder', __('Please write your request in detail.'));

    // Code responsible for blocking the editing of the "resolution_deadline" field
    frm.set_df_property('resolution_deadline', 'hidden', 0);

    if (!frappe.user.has_role(['Information Technology User', 'Administrator', 'System Manager'])) {
      frm.set_df_property('resolution_deadline', 'read_only', 1);
      frm.fields_dict['resolution_deadline']?.$wrapper?.on('click', function () {
        frappe.msgprint({
          title: __('Access Denied'),
          message: __('You do not have permission to edit the request resolution deadline.'),
          indicator: 'red'
        });
      });
    } else {
      frm.set_df_property('resolution_deadline', 'read_only', 0);
      frm.fields_dict['resolution_deadline']?.$wrapper?.off('click');
    }

    // Code for the 'problem_description' field
    frm.set_df_property('problem_description', 'hidden', 0);

    if (frappe.user.has_role(['Information Technology User', 'Administrator', 'System Manager'])) {
      frm.set_df_property('problem_description', 'read_only', 0);
      frm.fields_dict['problem_description']?.$wrapper?.off('click');
    } else {
      if (frm.doc['workflow_state'] === "Pending") {
        frm.set_df_property('problem_description', 'read_only', 0);
        frm.fields_dict['problem_description']?.$wrapper?.off('click');
      } else {
        frm.set_df_property('problem_description', 'read_only', 1);
        frm.fields_dict['problem_description']?.$wrapper?.off('click').on('click', function () {
          frappe.msgprint({
            title: __('Access Denied'),
            message: __('You do not have permission to edit the request description. Contact the administrator.'),
            indicator: 'red'
          });
        });
      }
    }

    // Form HTML elements adjustments
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
      console.error('agt.utils.form.adjust_html_elements is not available.');
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
    // More flexible regex to accept complex URLs from Google and other services
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

      // Strategy 1: Extract URLs using regex first (more precise)
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
      frappe.utils.play_sound("error"); // Error sound to get user's attention

      const plural = emptyRequiredFields.length > 1;
      frappe.throw({
        title: plural ? __('Required fields') : __('Required field'),
        message: `
                    <div>
                        ${plural ? __('The following fields are required and cannot be empty:')
            : __('The following field is required and cannot be empty:')}
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
      frappe.utils.play_sound("error"); // Error sound to get user's attention

      const plural = emptyLinkFields.length > 1;
      frappe.throw({
        title: plural ? __('Required link fields') : __('Required link field'),
        message: `
                    <div>
                        ${plural ? __('The following link fields are required and cannot be empty:')
            : __('The following link field is required and cannot be empty:')}
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
    //   frappe.utils.play_sound("error"); // Error sound to get user's attention

    //   const plural = invalidLinks.length > 1;
    //   frappe.throw({
    //     title: plural ? 'Invalid links' : 'Invalid link',
    //     message: `
    //                 <div>
    //                     ${plural ? 'The following links are not valid:'
    //         : 'The following link is not valid:'}
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
    (frm.doc['first_category'] === "Document" && frm.doc['second_category'] === "Editing") ||
    (frm.doc['first_category'] === "Document" && frm.doc['second_category'] === "Maintenance");

  if (isDocumentEditingOrMaintenance) {
    frappe.utils.play_sound("alert"); // Alert sound to get user's attention
    frappe.show_alert({
      message: __('Please include links related to document editing or maintenance.'),
      indicator: 'blue'
    }, 5);
  }
}