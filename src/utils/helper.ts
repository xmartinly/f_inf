import {
  Unlock,
  Checked,
  View,
  Printer,
  Delete,
  Finished,
  Edit,
  ChatDotSquare,
  Upload
} from "@element-plus/icons-vue";

const getIcons = (icon_text: string) => {
  let icon: any;
  switch (icon_text) {
    case "Print":
      icon = Printer;
      break;
    case "Delete":
      icon = Delete;
      break;
    case "Edit":
      icon = Edit;
      break;
    case "View":
      icon = View;
      break;
    case "Checked":
      icon = Checked;
      break;
    case "Upload":
      icon = Upload;
      break;
    case "Finished":
      icon = Finished;
      break;
    case "ChatDotSquare":
      icon = ChatDotSquare;
      break;
    default:
      icon = Unlock;
      break;
  }
  return icon;
};

export { getIcons };
