# Web3Forms contact setup (2 minutes)

Your contact form uses **Web3Forms** and sends to **christopherlee812@gmail.com**.

## 1. Create a free access key

1. Open: https://web3forms.com/#start  
2. Enter: `christopherlee812@gmail.com`  
3. Submit  
4. Open your Gmail and copy the **Access Key** from Web3Forms  

## 2. Add the key (pick one)

### Option A — Tell me the key
Paste the access key in chat and I will add it to Vercel for you.

### Option B — Add it yourself in Vercel
1. https://vercel.com/mrchris21s-projects/portfolio-app/settings/environment-variables  
2. Add:

| Name | Value |
|------|--------|
| `WEB3FORMS_ACCESS_KEY` | your-access-key |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | your-access-key (same) |

3. Apply to **Production**, **Preview**, **Development**  
4. Redeploy the project  

### Option C — Local `.env.local`
```bash
WEB3FORMS_ACCESS_KEY=your-access-key
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key
```

## 3. Test
Open Contact → send a test message → check Gmail.
