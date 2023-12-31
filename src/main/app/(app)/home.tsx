import { makeTodoValidation } from "@/main/factories/validation";
import { TodoManagement } from "@/presentation/pages";

export default function Home() {
  return <TodoManagement validation={makeTodoValidation()} />;
}
