import {
  Box,
  Button,
  Loader,
  Text,
  Tooltip,
} from '@airtable/blocks/ui';
import React, {useState, useEffect} from 'react';
import {
  newWordPressPost,
  updateWordPressPost,
  deleteWordPressPost,
} from './wordPressApiHelperFunctions';

function PostRecordToWordPress({table, record, settings, jsonWebToken}) {
  // fetch status stored in state
  const [fetchStatus, setFetchStatus] = useState("notAttempted");
  // get domain name
  const wordPressDomain = settings.wordPressDomain;
  // get fields from settings
  // const {postIdField, titleField, contentField, slugField, dateField, stickyField, categoryField, tagField} = settings;
  // get cell values
  const postId = record.getCellValue(settings.postIdField);
  const title = record.getCellValueAsString(settings.titleField);
  const content = record.getCellValueAsString(settings.contentField);
  const slug = settings.slugField ? record.getCellValueAsString(settings.slugField) : null;
  const dateValue = settings.dateField ? record.getCellValue(settings.dateField) : null;
  const dateAsString = settings.dateField ? record.getCellValueAsString(settings.dateField) : null;
  let sticky = settings.stickyField ? record.getCellValueAsString(settings.stickyField) : null;
  sticky = sticky ? true : false;
  const categoriesAsString = settings.categoryField ? record.getCellValueAsString(settings.categoryField) : null;
  const categoriesValue = categoriesAsString ? categoriesAsString.split(",").map(item => parseInt(item)) : []
  const tagsAsString = settings.tagField ? record.getCellValueAsString(settings.tagField) : null;
  const tagsValue = tagsAsString ? tagsAsString.split(",").map(item => parseInt(item)) : []

  const getWordPressPostBody = () => {
    let body = {};
    body.title = title;
    body.content = content;
    if (settings.slugField) { body.slug = slug }
    if (settings.dateField) { body.date_gmt = dateValue }
    if (settings.stickyField) {body.sticky = sticky }
    if (settings.categoryField) { body.categories = categoriesValue }
    if (settings.tagField) { body.tags = tagsValue }
    body.status = "publish" // TODO allow for more statuses "publish", "future", "draft", "pending", "private"
    return body;
  }


  const newPost = () => {
    setFetchStatus("fetching")
    const postBody = getWordPressPostBody();
    const callback = (data) => {
      if (data && data.id) {
        setFetchStatus("success")
        table.updateRecordAsync(record, {[settings.postIdField.name]: data.id});
      } else {
        setFetchStatus("failed")
      }
    };
    newWordPressPost(wordPressDomain, jsonWebToken, postBody, callback);
  }


  const updatePost = () => {
    setFetchStatus("fetching")
    const postBody = getWordPressPostBody();
    const callback = (data) => {
      if (data && data.id) {
        setFetchStatus("success")
        table.updateRecordAsync(record, {[settings.postIdField.name]: data.id});
      } else {
        setFetchStatus("failed")
      }
    };
    updateWordPressPost(wordPressDomain, jsonWebToken, postId, postBody, callback)
  }


  const deletePost = () => {
    setFetchStatus("fetching")
    const callback = (data) => {
      console.log(data)
      if (data && data.id) {
        setFetchStatus("success")
        table.updateRecordAsync(record, {[settings.postIdField.name]: null});
      } else {
        setFetchStatus("failed")
      }
    };
    deleteWordPressPost(wordPressDomain, jsonWebToken, postId, callback)
  }


  if (fetchStatus == "fetching") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding="20px"
        width="100vw"
        height="100vh"
        overflow="hidden"
      >
        <Text textAlign="center">Request sent to </Text>
        <Text textAlign="center">{wordPressDomain}</Text>
        <br />
        <Text textAlign="center">Waiting for the response.</Text>
        <br />
        <Loader scale={0.3} />
      </Box>
    )
  }


  if (fetchStatus == "failed") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding="20px"
        width="100vw"
        height="100vh"
        overflow="hidden"
      >
        <Text textAlign="center">
          Request failed<br/>
        </Text><br />
        <Text textAlign="center">
          Make sure your WordPress user account is authorized to create, edit, and delete posts.
        </Text><br />
        <Button
          variant="primary"
          onClick={() => {setFetchStatus("notAttempted")}}
        >
        Dismiss
        </Button>
      </Box>
    )
  }


  if (fetchStatus == "success") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding="20px"
        width="100vw"
        height="100vh"
        overflow="hidden"
      >
        <Text textAlign="center">
          Success!<br/>
        </Text><br />
        <Button
          variant="primary"
          onClick={() => {setFetchStatus("notAttempted")}}
        >
        Dismiss
        </Button>
      </Box>
    )
  }

  return (
    <Box
    border="none"
    padding="15px"
    width="100%"
    height="90vh"
    display="flex"
    flexDirection="row"
    >
      <Box>
        <Text paddingY="5px"><b>title:</b> {title}</Text>
        {settings.slugField ? <Text paddingY="5px"><b>slug:</b> {slug}</Text> : ""}
        {settings.dateField ? <Text paddingY="5px"><b>date:</b> {dateAsString}</Text> : ""}
        {settings.stickyField ? <Text paddingY="5px"><b>sticky:</b> {sticky ? "yes" : "no" }</Text> : ""}
        {settings.categoryField ? <Text paddingY="5px"><b>category numbers:</b> {categoriesAsString}</Text> : ""}
        {settings.tagField ? <Text paddingY="5px"><b>tag numbers:</b> {tagsAsString}</Text> : ""}
        <Text paddingY="5px"><b>post id:</b> {postId}</Text>
        <Button
          marginY="5px"
          variant="primary"
          disabled={!title}
          onClick={postId ? updatePost : newPost }
        >
        {postId ? "Update Post" : "Create Post"}
        </Button>
        <Tooltip
          content="Post will be deleted only from WordPress. The record will remain in Airtable."
          placementX={Tooltip.placements.CENTER}
          placementY={Tooltip.placements.BOTTOM}
          shouldHideTooltipOnClick={true}
        >
          <Button
            marginY="5px"
            variant="danger"
            disabled={!postId}
            onClick={deletePost }
          >
            Delete Post
          </Button>
        </Tooltip>
      </Box>
      <iframe
        srcDoc={"<style>" + settings.customCss + "</style>"+ content}
        style={{width: '90%', padding: '5px', minHeight: '0', height: '100%'}}
      >
      </iframe>
    </Box>
  );
}


export default PostRecordToWordPress;
