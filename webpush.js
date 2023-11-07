const webpush = require("web-push");
//const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;
const PUBLIC_VAPID_KEY='BMvBpz1YNIZztG_lBJlMNbZly6eGypY8-SYcbM4zU95bNIWJ3Z6-vsJ0fQ4rQqK9LJFYHINOGCPha04BxGLSYEU'
const PRIVATE_VAPID_KEY='OvUj7E4uYi3EkzKNutX_G-fIpMWMx40RJfcSOy9Enyo'


webpush.setVapidDetails(
  "mailto:alejodc412@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

module.exports = webpush;