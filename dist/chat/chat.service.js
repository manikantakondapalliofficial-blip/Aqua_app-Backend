"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../common/supabase/supabase.client");
let ChatService = class ChatService {
    async getMessages(userId1, userId2) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
            .order('created_at', { ascending: true });
        if (error) {
            console.error('Error fetching chat messages:', error);
            throw new common_1.InternalServerErrorException('Could not fetch chat messages');
        }
        return data;
    }
    async saveMessage(senderId, receiverId, content, imageUrl) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
            sender_id: senderId,
            receiver_id: receiverId,
            content: content,
            image_url: imageUrl,
        })
            .select()
            .single();
        if (error) {
            console.error('Error saving chat message:', error);
            throw new common_1.InternalServerErrorException('Could not save chat message');
        }
        return data;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map