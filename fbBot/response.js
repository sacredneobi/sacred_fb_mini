const genQuickReply = (text, quickReplies) => {
  let response = {
    text,
    quick_replies: Array.isArray(quickReplies)
      ? quickReplies.map((item) => ({
          content_type: "text",
          ...item,
        }))
      : null,
  };

  return response;
};

const genButton = (data) => {
  if (data.url) {
    return { type: "web_url", messenger_extensions: true, ...data };
  }
  if (data.payload) {
    return { type: "postback", ...data };
  }
};

const genImageReply = (title, data, buttons, sharable) => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        sharable,
        elements: [
          {
            title,
            image_url: data?.img,
            subtitle: data?.subtitle,
            default_action: data?.defAction ? genButton(data.defAction) : null,
            buttons: Array.isArray(buttons)
              ? buttons.map((item) => genButton(item))
              : null,
          },
        ],
      },
    },
  };

  return response;
};

module.exports = { genQuickReply, genImageReply };
