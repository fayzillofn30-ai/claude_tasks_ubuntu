import axios from "axios";

export const getUsers = (setUser: Function) => {
    axios.get("http://localhost:15976/api/users/get-all", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    }).then(result => {
        console.log(result)
        const usersData = result.data.data.map((user: Record<string, any>) => {
            return {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
            };
        });
        setUser(usersData)
    }).catch(err => {
        console.log(err);
    });
};