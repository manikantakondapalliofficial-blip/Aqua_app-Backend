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
const https = __importStar(require("https"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function uploadBanner() {
    const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Downloading real placeholder image...');
    const file = fs.createWriteStream('real_placeholder.png');
    await new Promise((resolve, reject) => {
        https.get('https://placehold.co/1200x600/006096/ffffff/png?text=Aqua+Farmer+Hero+Banner', (response) => {
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
    console.log('Image downloaded. Uploading directly to Supabase...');
    const buffer = fs.readFileSync('real_placeholder.png');
    const fileName = `${Date.now()}-real-placeholder.png`;
    const filePath = `banners/${fileName}`;
    const { data, error } = await supabase.storage
        .from('bills')
        .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: false,
    });
    if (error) {
        console.error('Supabase upload error:', error);
    }
    else {
        console.log('Successfully uploaded banner to Supabase!', data);
        const { data: list } = await supabase.storage.from('bills').list('banners');
        if (list) {
            const badFiles = list.filter(f => f.name.includes('placeholder.jpg')).map(f => `banners/${f.name}`);
            if (badFiles.length > 0) {
                await supabase.storage.from('bills').remove(badFiles);
                console.log('Cleaned up bad files:', badFiles);
            }
        }
    }
    fs.unlinkSync('real_placeholder.png');
}
uploadBanner();
//# sourceMappingURL=fix_placeholder.js.map