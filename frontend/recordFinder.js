  import {
    Box,
    Button,
    Text,
    useRecordById,
    useWatchable,
  } from '@airtable/blocks/ui';
  import {cursor} from '@airtable/blocks';
  import React, {useState} from 'react';
  import PostRecordToWordPress from './postRecordToWordPress';

  function RecordFinder({settings, jsonWebToken}) {
    // unpack the settings
    const table = settings.table;
    const wordPressDomain = settings.wordPressDomain;
    // watch for the current record
    const [activeTableId, setActiveTableId] = useState(null);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    // use the cursor to determine the active record and field
    useWatchable(cursor, ['activeTableId', 'selectedRecordIds'], () => {
      setActiveTableId(cursor.activeTableId);
      // check if the active table is the table from the settings
      const matchingTable = (cursor.activeTableId == table.id)
      if (!matchingTable) {
        // the active table isn't the settings table, so the selected record doesn't matter
        setSelectedRecordId("");
        return;
      }
      if (matchingTable && cursor.selectedRecordIds.length > 0) {
        // at least one record is selected, so pick the first
        setSelectedRecordId(cursor.selectedRecordIds[0]);
      }
    });

    // use the hook to trigger re-renders whenever the record data changes
    const record = useRecordById(table, selectedRecordId ? selectedRecordId : "a_string_because_null_failed");

    if (cursor.activeTableId != table.id) {
      // The active table isn't the table in the settings,
      // so state what the block does, and have button to go to the table
      return (
        <Box
          border="none"
          backgroundColor="white"
          padding="15px"
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text textAlign='center' margin='1em'>
            Use this block to create, update, and delete posts on the<br/>
            <strong>{wordPressDomain}</strong> website<br/>
            from records in the <strong>{table.name}</strong> table.
          </Text>
          <Button
            variant="primary"
            onClick={()=>cursor.setActiveTable(table.id)}
          >
          Show <strong>{table.name}</strong> table
          </Button>
        </Box>
      )
    } else if (record) {
      // one of the field for this block is selected, so show the info
      return (
        <PostRecordToWordPress
          settings={settings}
          table={table}
          record={record}
          jsonWebToken={jsonWebToken}
        />
      )
    } else {
      // the table from the settings is active, but no record is selected
      return (
        <Box
          border="none"
          backgroundColor="white"
          padding="15px"
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
        <Text textAlign='center' margin='1em'>
          Select a record to in a <b>grid view</b><br/>
          to publish or delete it from the<br/>
          <strong>{wordPressDomain}</strong> website.
        </Text>
        </Box>
      )
    }
  }


  export default RecordFinder;
