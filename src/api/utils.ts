// export const App_Request = new AppRequest();

const is_dev = true;

const local = "http://127.0.0.1:8000/api/";
const remote = "https://order-api.infcd.com/api/";
export const baseUrlApi = (url: string) => {
  return is_dev ? `${local}${url}` : `${remote}${url}`;
};
