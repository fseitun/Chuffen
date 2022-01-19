import { createContext } from "react";

const UserContext = createContext({

    id: null,
    user: null,
    estado: null,
    personaId: null,
    mail: null,
    avatar: null, 
    rol_id: null,
    rol_descripcion: null,
    rol_accesoTXT: null

});

export default UserContext;