const loginModule = (() => {

    const loginUser = async (id, password) => {
        try {
            let res = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content

                },
                body: JSON.stringify({
                    id: id,
                    password: password,
                })
            })
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    return {
        loginUser,
    }
})();
