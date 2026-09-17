"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const fs = __importStar(require("fs"));
const http = __importStar(require("http"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function uploadBanner() {
    const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Downloading placeholder image...');
    const file = fs.createWriteStream('placeholder.jpg');
    await new Promise((resolve, reject) => {
        http.get('http://via.placeholder.com/1200x600/006096/ffffff?text=Aqua+Farmer+Hero+Banner', (response) => {
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
    console.log('Image downloaded. Uploading directly to Supabase...');
    const buffer = fs.readFileSync('placeholder.jpg');
    const fileName = `${Date.now()}-placeholder.jpg`;
    const filePath = `banners/${fileName}`;
    const { data, error } = await supabase.storage
        .from('bills')
        .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: false,
    });
    if (error) {
        console.error('Supabase upload error:', error);
    }
    else {
        console.log('Successfully uploaded banner to Supabase!', data);
    }
    fs.unlinkSync('placeholder.jpg');
}
uploadBanner();
//# sourceMappingURL=direct_upload_banner.js.map