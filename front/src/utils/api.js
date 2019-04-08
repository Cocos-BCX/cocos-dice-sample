export default (...args) => {
  return fetch(...args).then(res => {
    if (res.ok) return res.json();
    return Promise.reject(res);
  });
};

