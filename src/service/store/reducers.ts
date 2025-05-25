import { combineReducers } from "redux";
import auth from "../store/auth/auth.reducer";
import user from "../store/user/user.reducers";
import role from "../store/role/role.reducer";
import advertiment from "../store/advertiment/advertiment.reducer";
import advertisingField from "../store/advertising-field/advertising-field.reducer";
import approval from "../store/approval/approval.reducer";

const rootReducer = combineReducers({
  auth,
  user,
  role,
  advertiment,
  advertisingField,
  approval,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
