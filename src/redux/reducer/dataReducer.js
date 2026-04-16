import { REGISTER_USER_FAILURE, 
    REGISTER_USER_REQUEST, 
    REGISTER_USER_SUCCESS,
    LOGIN_USER_REQUEST, 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    FETCH_USERS_REQUEST, 
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    REQUEST_CURRENT_USER_REQUEST,
    REQUEST_CURRENT_USER_SUCCESS,
    REQUEST_CURRENT_USER_FAILURE,
    LOGOUT_USER_REQUEST,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE,
    getUserById_REQUEST,
    getUserById_SUCCESS,
    getUserById_FAILURE,
    REQUEST_UPDATE_USER_STATUS_REQUEST,
    REQUEST_UPDATE_USER_STATUS_SUCCESS,
    REQUEST_UPDATE_USER_STATUS_FAILURE
   
} from "../action/dataAction"
const initialState = {
    loading: false,
    error: "",
    currentUser: null,
    selectedUser: null,
    users: []
}

const dataReducer = (state = initialState, action) => {
  switch(action.type){
     case REGISTER_USER_REQUEST:
     case LOGIN_USER_REQUEST:
     case FETCH_USERS_REQUEST:
     case REQUEST_CURRENT_USER_REQUEST:
     case LOGOUT_USER_REQUEST:
     case getUserById_REQUEST:
        return {
            ...state,
            loading: true,
            error: ""
        }
     case UPDATE_USER_REQUEST:
     case REQUEST_UPDATE_USER_STATUS_REQUEST:
        return {
            ...state,   
            loading: true,
            error: ""
        }   
     case REGISTER_USER_SUCCESS:
     case LOGIN_USER_SUCCESS:
     case REQUEST_CURRENT_USER_SUCCESS:
     case UPDATE_USER_SUCCESS:
        return {
            ...state,
            loading: false,
            currentUser: action.payload,
            error: ""
        }
     case FETCH_USERS_SUCCESS:
        return {
            ...state,
            loading: false,
            users: action.payload,
            error: ""
        }
     case getUserById_SUCCESS:
        return {
            ...state,
            loading: false,
            selectedUser: action.payload,
            error: ""
        }
        case REQUEST_UPDATE_USER_STATUS_SUCCESS:
        return {
            ...state,
            loading: false,
            users: state.users.map(user => user._id === action.payload._id ? action.payload : user),
            error: ""
        }
        case REQUEST_UPDATE_USER_STATUS_FAILURE:        
        return {
            ...state,
            loading: false,
            error: action.payload
        }
     case LOGOUT_USER_SUCCESS:
        return {
            ...state,
            loading: false,
            currentUser: null,
            error: ""
        }    
     case REGISTER_USER_FAILURE:
     case LOGIN_USER_FAILURE:   
     case FETCH_USERS_FAILURE:
     case UPDATE_USER_FAILURE:
     case REQUEST_CURRENT_USER_FAILURE:
     case LOGOUT_USER_FAILURE:
     case getUserById_FAILURE:         
        return {
            ...state,
            loading: false,
            error: action.payload
        }
     default:
        return state;

  }

}  

export default dataReducer;