import {
  Box,
  Button,
  Loader,
  Text,
} from '@airtable/blocks/ui';
import React, {useState, useEffect} from 'react';
import {
  newWordPressPost,
  updateWordPressPost,
} from './wordPressApiHelperFunctions';

function PostRecordToWordPress({table, record, settings, jsonWebToken}) {
  // fetch status stored in state
  const [fetchStatus, setFetchStatus] = useState("notAttempted");
  // get domain name
  const wordPressDomain = settings.wordPressDomain;
  // get cell values
  const postId = record.getCellValue(settings.postIdField);
  const title = record.getCellValueAsString(settings.titleField);
  const content = record.getCellValueAsString(settings.contentField);
  const slug = settings.slugField ? record.getCellValueAsString(settings.slugField) : null;
  const dateValue = settings.dateField ? record.getCellValue(settings.dateField) : null;
  const dateAsString = settings.dateField ? record.getCellValueAsString(settings.dateField) : null;
  let sticky = settings.stickyField ? record.getCellValueAsString(settings.stickyField) : null;
  sticky = sticky ? true : false;
  const categoriesAsString = record.getCellValueAsString(settings.categoryField);
  const categoriesValue = categoriesAsString ? categoriesAsString.split(",").map(item => parseInt(item)) : []
  const tagsAsString = record.getCellValueAsString(settings.tagField);
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
    const url = wordPressDomain + "/wp-json/wp/v2/posts";
    const postBody = getWordPressPostBody();
    const callback = (data) => {
      if (data) {
        console.log(data)
      }
      if (data.id) {
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
    const url = wordPressDomain + "/wp-json/wp/v2/posts/" + postId + "/";
    const postBody = getWordPressPostBody();
    const callback = (data) => {
      console.log(data)
      if (data.id) {
        setFetchStatus("success")
        // table.updateRecordAsync(record, {[settings.postIdField.name]: data.id});
      } else {
        setFetchStatus("failed")
      }
    };
    updateWordPressPost(wordPressDomain, jsonWebToken, postId, postBody, callback)
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
        <Text textAlign="center">Sending <i>{title}</i> to </Text>
        <Text textAlign="center">{wordPressDomain}</Text>
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
          Unable to post to <br/>
          <strong>{wordPressDomain}</strong><br/>
        </Text><br />
        <Text textAlign="center">
          Make sure you are logged into the website as a user who is authorized to create and edit posts.
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
    <div>
      <div>
      <Text>post id: {postId}</Text>
      <Text>title: {title}</Text>
      <Text>slug: {slug}</Text>
      <Text>date: {dateAsString}</Text>
      <Text>sticky: {sticky ? "yes" : "no" }</Text>
      <Text>category numbers: {categoriesAsString}</Text>
      <Text>tag numbers: {tagsAsString}</Text>
      </div>
      <Button
        variant="primary"
        onClick={postId ? updatePost : newPost }
      >
      {postId ? "Update Post" : "Create Post"}
      </Button>
      <iframe
        srcDoc={content}
        style={{width: '100%', height: '100%'}}
      >
      </iframe>
    </div>
  );
}


export default PostRecordToWordPress;
