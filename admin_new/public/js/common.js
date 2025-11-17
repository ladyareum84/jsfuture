const commonModule = (() => {

    const sendPost = (url, params) => {
        let form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('target', '');
        form.setAttribute('action', url);
        document.charset = "UTF-8";

        for (let key in params) {

            let hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);
            form.appendChild(hiddenField);

        }
        document.body.appendChild(form);
        form.submit();
    }
    return {
        sendPost,
    }
})();
