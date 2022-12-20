import { createContext, Dispatch } from "react"
type AppContextProps = [
  any,
  Dispatch<{type: string, payload?: any}>
]
const AppContext = createContext<AppContextProps>([{}, () => {}])
export default AppContext

