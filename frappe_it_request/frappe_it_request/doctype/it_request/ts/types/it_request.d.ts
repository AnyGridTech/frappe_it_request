// frappe_it_request.d.ts

import { FrappeForm } from "@anygridtech/frappe-types/client/frappe/core";

/**
 * Represents the IT Request document structure in ERPNext/Frappe.
 */
export interface ITRequestDoc extends Record<string, any> {
  name: string;   // The name/ID of the document
  applicant_name?: string; // The user who created the request
  applicant_email?: string; // E-mail from the user who created the request
  sector_applicant?: string; // The sector/department of the applicant
  employee_sector?: string; // The sector/department of the employee
  first_category?: string; // First level category (Sistema, Documento, Infraestrutura, etc.)
  second_category?: string; // Second level category (Movidesk, ERPNext, Edição, etc.)
  third_category?: string; // Third level category (specific request type)
  problem_description?: string; // Description of the problem/request
  resolution_deadline?: string; // Deadline for resolution
  workflow_state?: string; // Current workflow state
  custom_workflow_history?: string; // Custom workflow history HTML field
  attach?: string; // Attachments
}

/**
 * Represents a subcategory with its options.
 */
export type SubcategoryOptions = string[];

/**
 * Represents a category with its subcategories.
 */
export type CategoryMap = Record<string, SubcategoryOptions>;

/**
 * Hierarchical structure of IT Request categories.
 * 
 * Structure:
 * - Top-level: Main categories (System, Document, Infrastructure, etc.)
 * - Second-level: Subcategories (Movidesk, ERPNext, Editing, etc.)
 * - Third-level: Specific request types (arrays of strings)
 */
export interface ITRequestCategories {
  'System': { // System-related requests
    'Movidesk': SubcategoryOptions;
    'ERPNext': SubcategoryOptions;
    'API': SubcategoryOptions;
    [key: string]: SubcategoryOptions;
  };
  'Document': { // Document-related requests
    'Editing': SubcategoryOptions;
    'Creation': SubcategoryOptions;
    'Maintenance': SubcategoryOptions;
    [key: string]: SubcategoryOptions;
  };
  'Infrastructure (Equipment)': { // Infrastructure equipment requests
    'Office': SubcategoryOptions;
    'Warehouse': SubcategoryOptions;
    'Office and Warehouse': SubcategoryOptions;
    [key: string]: SubcategoryOptions;
  };
  'Infrastructure (Applications)': { // Infrastructure applications requests
    'Office': SubcategoryOptions;
    'Warehouse': SubcategoryOptions;
    'Office and Warehouse': SubcategoryOptions;
    [key: string]: SubcategoryOptions;
  };
  'Human Resources': { // Human Resources requests
    'Office': SubcategoryOptions;
    'Warehouse': SubcategoryOptions;
    'Office and Warehouse': SubcategoryOptions;
    [key: string]: SubcategoryOptions;
  };
  [key: string]: CategoryMap; // Allow dynamic string indexing
}

/**
 * Represents a version change record.
 */
export interface VersionChange {
  0: string; // Field name that changed
  1: any; // Old value
  2: any; // New value
}

/**
 * Represents version data structure from Frappe Version doctype.
 */
export interface VersionData {
  changed?: VersionChange[]; // Array of changes [fieldname, oldValue, newValue]
  added?: boolean; // Indicates if the document was added/created
  row_changed?: any[]; // Row changes for child tables
}

/**
 * Field information for formatting values.
 */
export interface FieldInfo {
  label: string; // Display label of the field
  fieldtype: string; // Field type (Link, Select, Date, etc.)
  options?: string; // Options for Link or Select fields
}

/**
 * Represents a change item in the history tracking.
 */
export interface HistoryChangeItem {
  type: 'change' | 'creation' | 'communication' | 'assignment' | 'share' | 'tag' | 'attachment' | 'email_queue' | 'activity'; // Type of change/event
  creation: string; // Creation timestamp
  modified?: string; // Modified timestamp (for changes)
  owner: string; // User who made the change
  icon: string; // Icon class for display
  category: string; // Category label for grouping
  fieldname?: string; // Field name (for change type)
  fieldInfo?: FieldInfo; // Field information (for change type)
  oldValue?: any; // Old value (for change type)
  newValue?: any; // New value (for change type)
  subject?: string; // Subject (for communication/activity)
  content?: string; // Content (for communication/activity)
  comm_type?: string; // Communication type (Email, Comment, etc.)
  direction?: string; // Direction (sent/received)
  status?: string; // Status
  assigned_to?: string; // Assigned to user (for assignment)
  description?: string; // Description (for assignment)
  priority?: string; // Priority (for assignment)
  shared_with?: string; // Shared with user (for share)
  permissions?: string; // Permissions (for share)
  tag_name?: string; // Tag name (for tag)
  file_name?: string; // File name (for attachment)
  file_url?: string; // File URL (for attachment)
  file_size?: number; // File size in bytes (for attachment)
  is_private?: number; // Is private file (for attachment)
  recipients?: string; // Email recipients (for email)
  error?: string; // Error message (for email)
  message?: string; // Email message (for email)
  operation?: string; // Operation type (for activity)
}

/**
 * Options for adjusting HTML elements in forms.
 */
export interface AdjustHTMLOptions {
  removeTabs?: boolean; // Remove tabs from form
  removeSidebar?: boolean; // Remove sidebar from form
  removeAssignments?: boolean; // Remove assignments section
  removeAssignmentsButton?: boolean; // Remove assignments button
  removeAttachments?: boolean; // Remove attachments section
  removeAttachmentsButton?: boolean; // Remove attachments button
  removeShared?: boolean; // Remove shared section
  removeTags?: boolean; // Remove tags section
  removeSidebarStats?: boolean; // Remove sidebar stats
  removeSidebarMenu?: boolean; // Remove sidebar menu
  removeSidebarReset?: boolean; // Remove sidebar reset button
  removeSidebarToggle?: boolean; // Remove sidebar toggle
}


/**
 * Utility functions for IT Request form.
 */
export declare namespace ITRequestUtils {
  /**
   * Sets options for a select field in the form.
   * @param frm - The Frappe form instance
   * @param fieldName - Name of the field to set options for
   * @param options - Array of option strings
   */
  function setOptions(frm: FrappeForm, fieldName: string, options: string[] | undefined): void;

  /**
   * Clears subsequent category fields based on the level.
   * @param frm - The Frappe form instance
   * @param level - The category level (1, 2, or 3)
   */
  function clearSubsequentCategories(frm: FrappeForm, level: number): void;

  /**
   * Updates options for category fields based on parent selections.
   * @param frm - The Frappe form instance
   * @param categoryLevel - The category level to update (1, 2, or 3)
   */
  function updateOptions(frm: FrappeForm, categoryLevel: number): void;

  /**
   * Initializes the form with default values and options.
   * @param frm - The Frappe form instance
   */
  function initializeForm(frm: FrappeForm): Promise<void>;

  /**
   * Checks if the selected categories require document editing or maintenance.
   * Shows an alert if applicable.
   * @param frm - The Frappe form instance
   */
  function checkDocumentEditingOrMaintenance(frm: FrappeForm): void;

  /**
   * Gets field information including label, type, and options.
   * @param fieldname - Name of the field
   * @returns Field information object
   */
  function getFieldInfo(fieldname: string): FieldInfo;

  /**
   * Formats a value based on field type for display.
   * @param value - The value to format
   * @param fieldInfo - Field information for formatting context
   * @returns Formatted HTML string
   */
  function formatValue(value: string | string[], fieldInfo: FieldInfo): string;
}

export { };
