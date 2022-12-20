import { createContext, Dispatch } from "react"
import { initReducer, ReducerActionProps, ReducerStateProps } from "./reducer"
type AppContextProps = [
  ReducerStateProps,
  Dispatch<ReducerActionProps>
]
const AppContext = createContext<AppContextProps>([
  initReducer(0),
  () => {}
])
export default AppContext

