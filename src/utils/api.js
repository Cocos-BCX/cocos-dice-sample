export default (...args) => {
  return fetch(...args).then(res => {
    if (res.ok) return Promise.inject(res.json());
    return Promise.reject(res);
  });
};

