import JsonObject from "../../Utils/JsonObject";


export default abstract class Effect extends JsonObject {
  public abstract activate(): void;
}
