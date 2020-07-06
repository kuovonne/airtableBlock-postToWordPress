import {
  Button,
  FieldPickerSynced,
  FormField,
  InputSynced,
  TablePickerSynced,
  useBase,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function BlockSettings({setIsShowingSettings}) {
  const globalConfig = useGlobalConfig();
  const base = useBase();
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  const settings = validateSettings();
  const canSetSettings = globalConfig.checkPermissionsForSet('customCss').hasPermission;

  return (
    <div style={{padding: '15px', 'height': '100vh'}}>
      <FormField
        label="WordPress Domain"
        description="Must include https://"
      >
        <InputSynced
          globalConfigKey={'wordPressDomain'}
          placeholder='https://blog.example.com'
        />
      </FormField>
      <FormField
        label="Table containing posts"
        description="Records will be published as WordPress posts"
      >
        <TablePickerSynced
          globalConfigKey='tableId'
        />
      </FormField>
      <FormField
        label="WordPress Post Id field (required)"
        description="Users must have permissions to update this number field"
      >
        <FieldPickerSynced table={table}
          allowedTypes={["number"]}
          globalConfigKey='postIdFieldId'
        />
      </FormField>
      <FormField
        label="Title field (required)"
        description="Can be any field type that produces title text"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='titleFieldId'
        />
      </FormField>
      <FormField
        label="Content field (required)"
        description="Can be any field type that contains the full HTML content of post"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='contentFieldId'
        />
      </FormField>
      <FormField
        label="Slug field (optional)"
        description="Can be any field type that produces a slug"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='slugFieldId'
        />
      </FormField>
      <FormField
        label="Date field (optional)"
        description="Must be a date field that also shows a time"
      >
        <FieldPickerSynced table={table}
          allowedTypes={["dateTime"]}
          globalConfigKey='dateFieldId'
        />
      </FormField>
      <FormField
        label="Category Number field (optional)"
        description="Can be any field type that produces a comma separated list of WordPress category numbers"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='categoryFieldId'
        />
      </FormField>
      <FormField
        label="Tag Number field (optional)"
        description="Can be any field type that produces a comma separated list of WordPress tag numbers"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='tagFieldId'
        />
      </FormField>
      <FormField
        label="Sticky field (optional)"
        description="Can be any field type"
      >
        <FieldPickerSynced table={table}
          globalConfigKey='stickyFieldId'
        />
      </FormField>

      <div style={{display: 'flex', 'justifyContent': 'flex-end'}}>
      <Button
        variant="primary"
        onClick={()=>setIsShowingSettings(false)}
        disabled={!settings}
        alignSelf="flex-end"
      >
      Done
      </Button>
      </div>
      <p>Copyright © 2020, Kuovonne Vorderbruggen</p>
    </div>
  );
}

function validateSettings() {
  const globalConfig = useGlobalConfig();
  const base = useBase();
  // check if there is a table
  const table = base.getTableByIdIfExists(globalConfig.get('tableId'));
  if (!table) { return false; }
  // check if there is a WordPress domain
  const wordPressDomain = globalConfig.get('wordPressDomain');
  if (!wordPressDomain) {
    return false;
  }
  // check if there are the required fields
  const postIdField = table ? table.getFieldByIdIfExists(globalConfig.get('postIdFieldId')) : null;
  const titleField = table ? table.getFieldByIdIfExists(globalConfig.get('titleFieldId')) : null;
  const contentField = table ? table.getFieldByIdIfExists(globalConfig.get('contentFieldId')) : null;
  if (!postIdField || !titleField || !contentField) {
    return false;
  }
  // check for optional fields
  const slugField = table ? table.getFieldByIdIfExists(globalConfig.get('slugFieldId')) : null;
  const dateField = table ? table.getFieldByIdIfExists(globalConfig.get('dateFieldId')) : null;
  // date field must show a time
  if (dateField.type != "dateTime") {
    return false;
  }
  const stickyField = table ? table.getFieldByIdIfExists(globalConfig.get('stickyFieldId')) : null;
  const categoryField = table ? table.getFieldByIdIfExists(globalConfig.get('categoryFieldId')) : null;
  const tagField = table ? table.getFieldByIdIfExists(globalConfig.get('tagFieldId')) : null;
  return {
    "wordPressDomain" : globalConfig.get('wordPressDomain'),
    "table": table,
    "postIdField": postIdField,
    "titleField": titleField,
    "contentField": contentField,
    "dateField": dateField,
    "slugField": slugField,
    "stickyField": stickyField,
    "categoryField": categoryField,
    "tagField": tagField,
  };
}

export {validateSettings};
export default BlockSettings;
