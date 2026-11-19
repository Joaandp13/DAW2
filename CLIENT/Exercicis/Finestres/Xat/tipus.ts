export interface Message {
    id: number;
    user: string;
    text: string;
    type: "message" | "clear";
}