import{r as i,u as T,j as e,a as $}from"./app-Dd9qIzEE.js";import{A as me,S as J}from"./AdminLayout-DBF57H8C.js";import{M as f}from"./Modal-Dkpy87JQ.js";import{A as he,a as g}from"./ActionDropdown-B_2Oni6J.js";import{P as be}from"./plus-BJ9UGIzp.js";import{S as ue}from"./search-ZoH4K4-z.js";import{C as fe}from"./calendar-VjOD_GHt.js";import{R as ge}from"./rotate-ccw-BkS9pHAf.js";import{U as je}from"./user-check-jqxHFPu4.js";import{C as R}from"./credit-card-CJru-mbb.js";import{E as W}from"./eye-BANLnEeZ.js";import{c as G}from"./createLucideIcon-DuNJePjn.js";import{X as w}from"./x-7g9hNNB6.js";import{P as ve}from"./printer-_jBynFfV.js";import{C as Ne}from"./check-CXVdsI3t.js";import{C as ye}from"./copy-BIMRPCPH.js";import{S as we}from"./send-CiKR7geC.js";import"./users-DuUgQHEn.js";import"./shopping-bag-DqE-kPRz.js";import"./building-2-CTGANzIl.js";import"./refresh-cw-C7WC6_S7.js";import"./star-3Hq36sUb.js";import"./shield-check-DN1U2foS.js";import"./external-link-mz6u2XPc.js";import"./log-out-CyH2zv6P.js";import"./user-BteRCbkb.js";import"./circle-check-CsX4kAum.js";import"./transition-DyIvmo50.js";import"./chevron-down-Cc1_Fva-.js";const Ce=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M4.929 4.929 19.07 19.071",key:"196cmz"}]],Se=G("ban",Ce);const ke=[["path",{d:"M12 17V7",key:"pyj7ub"}],["path",{d:"M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8",key:"1elt7d"}],["path",{d:"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",key:"ycz6yz"}]],De=G("receipt",ke),q=["bKash","Nagad","Bank Transfer","Card","Cash"];function lt({orders:M,clients:C=[],users:_e=[],items:j=[],startDate:H="",endDate:K=""}){const Q=M.data||M,[Y,h]=i.useState(!1),[d,b]=i.useState(null),[o,u]=i.useState(null),[n,v]=i.useState(null),[s,S]=i.useState(null),[k,X]=i.useState(""),[D,O]=i.useState(H),[_,B]=i.useState(K),[A,L]=i.useState(!1),F=(t,a)=>{O(t),B(a);const l={};t&&(l.start_date=t),a&&(l.end_date=a),$.get("/admin/orders",l,{preserveState:!0})},Z=()=>{O(""),B(""),$.get("/admin/orders",{},{preserveState:!0})},ee=t=>{confirm(`Are you sure you want to cancel the order for "${t.client?.name||t.project_name||"Client"}"?`)&&$.patch(`/admin/orders/${t.id}`,{status:"cancelled"},{preserveScroll:!0})},E=()=>"INV-"+Math.random().toString(36).substring(2,8).toUpperCase(),{data:c,setData:x,post:te,processing:se,reset:z}=T({client_id:C[0]?.id||"",item_id:j[0]?.id||"",project_name:"",amount:"",status:"pending",progress:0,payment_method:"bKash",transaction_id:E(),delivery_date:""}),p=T({progress:0}),m=T({status:"paid",payment_method:"bKash",amount:""}),ae=()=>{z(),x({client_id:C[0]?.id||"",item_id:j[0]?.id||"",project_name:"",amount:"",status:"pending",progress:0,payment_method:"bKash",transaction_id:E(),delivery_date:""}),h(!0)},le=t=>{b(t),p.setData({progress:t.progress??0})},ne=t=>{u(t),m.setData({status:(t.status==="paid","paid"),payment_method:t.payment_method||"bKash",amount:t.amount||""})},oe=t=>{t.preventDefault(),te("/admin/orders",{preserveScroll:!0,onSuccess:()=>{h(!1),z()}})},re=t=>{t.preventDefault(),d&&p.patch(`/admin/orders/${d.id}`,{preserveScroll:!0,onSuccess:()=>{b(null)}})},ie=t=>{t.preventDefault(),o&&m.patch(`/admin/orders/${o.id}`,{preserveScroll:!0,onSuccess:()=>{u(null)}})},de=t=>{if(!t)return;const a=window.open("","_blank","width=900,height=1000");if(!a){alert("Please allow popups to print or save the invoice.");return}const l=t.client?.name||t.user?.name||"Valued Customer",r=t.client?.contact_person||"",P=t.client?.phone||t.user?.phone||"—",I=t.project_name||t.item?.name||"Software Development",xe=t.item?.name||"Custom Tech Solution",N=parseFloat(t.amount).toLocaleString(void 0,{minimumFractionDigits:2}),U=t.transaction_id||`INV-${t.id.toString().padStart(6,"0")}`,pe=new Date(t.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),y=t.status==="paid";a.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Invoice_${U}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                        background: #ffffff;
                        color: #0f172a;
                        padding: 40px 48px;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 24px;
                        margin-bottom: 24px;
                    }
                    .brand-title {
                        font-size: 24px;
                        font-weight: 900;
                        color: #1e40af;
                        letter-spacing: -0.5px;
                    }
                    .brand-sub {
                        font-size: 12px;
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .brand-info {
                        font-size: 11px;
                        color: #94a3b8;
                        font-family: 'JetBrains Mono', monospace;
                        margin-top: 8px;
                        line-height: 1.5;
                    }
                    .invoice-tag-box {
                        text-align: right;
                    }
                    .badge-stamp {
                        display: inline-block;
                        padding: 6px 14px;
                        border-radius: 8px;
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-bottom: 8px;
                        border: 1px solid ${y?"#10b981":"#f59e0b"};
                        background: ${y?"#ecfdf5":"#fffbeb"};
                        color: ${y?"#047857":"#b45309"};
                    }
                    .invoice-title {
                        font-size: 26px;
                        font-weight: 900;
                        color: #0f172a;
                        letter-spacing: -0.5px;
                    }
                    .invoice-num {
                        font-family: 'JetBrains Mono', monospace;
                        font-weight: 700;
                        font-size: 13px;
                        color: #2563eb;
                        margin-top: 2px;
                    }
                    .grid-2 {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 24px;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 18px 20px;
                        margin-bottom: 28px;
                        font-size: 12px;
                    }
                    .meta-label {
                        font-size: 10px;
                        font-weight: 800;
                        text-transform: uppercase;
                        color: #94a3b8;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                    }
                    .client-name {
                        font-size: 14px;
                        font-weight: 800;
                        color: #0f172a;
                    }
                    .client-meta {
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .meta-row {
                        margin-bottom: 4px;
                        color: #475569;
                    }
                    .meta-row strong {
                        color: #0f172a;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 24px;
                        font-size: 12px;
                    }
                    th {
                        background: #f1f5f9;
                        border-top: 1px solid #cbd5e1;
                        border-bottom: 2px solid #cbd5e1;
                        padding: 12px 14px;
                        font-weight: 800;
                        text-transform: uppercase;
                        font-size: 10px;
                        color: #475569;
                        letter-spacing: 0.5px;
                    }
                    td {
                        padding: 16px 14px;
                        border-bottom: 1px solid #f1f5f9;
                        vertical-align: top;
                    }
                    .item-title {
                        font-size: 13px;
                        font-weight: 800;
                        color: #0f172a;
                    }
                    .item-desc {
                        font-size: 11px;
                        color: #64748b;
                        margin-top: 2px;
                    }
                    .totals-container {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 36px;
                    }
                    .totals-box {
                        width: 280px;
                        font-size: 12px;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 6px 0;
                        color: #475569;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .grand-total {
                        display: flex;
                        justify-content: space-between;
                        padding: 14px 16px;
                        background: #eff6ff;
                        border: 1px solid #bfdbfe;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 900;
                        color: #1e40af;
                        margin-top: 10px;
                    }
                    .footer {
                        text-align: center;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 24px;
                        font-size: 11px;
                        color: #94a3b8;
                        line-height: 1.6;
                    }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 15mm; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div>
                            <div class="brand-title">IT SOLUTIONS</div>
                            <div class="brand-sub">Enterprise Software & Digital Engineering</div>
                            <div class="brand-info">
                                Dhaka, Bangladesh &bull; Hotline: +880 1800-000000<br/>
                                support@itsolutions.com &bull; www.itsolutions.com
                            </div>
                        </div>
                        <div class="invoice-tag-box">
                            <div class="badge-stamp">${y?"✓ PAID & SETTLED":"⏳ PENDING INVOICE"}</div>
                            <div class="invoice-title">INVOICE</div>
                            <div class="invoice-num">#${U}</div>
                        </div>
                    </div>

                    <div class="grid-2">
                        <div>
                            <div class="meta-label">Billed To</div>
                            <div class="client-name">${l}</div>
                            ${r?`<div class="client-meta">${r}</div>`:""}
                            <div class="client-meta" style="font-family: 'JetBrains Mono', monospace;">${P}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="meta-label">Invoice Details</div>
                            <div class="meta-row">Issue Date: <strong>${pe}</strong></div>
                            <div class="meta-row">Payment Method: <strong>${t.payment_method||"Online"}</strong></div>
                            <div class="meta-row">Added By: <strong>${t.added_by||"Admin"}</strong></div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px; text-align: center;">#</th>
                                <th>Project / Service Deliverable</th>
                                <th style="width: 60px; text-align: center;">Qty</th>
                                <th style="width: 130px; text-align: right;">Price</th>
                                <th style="width: 140px; text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: center; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">01</td>
                                <td>
                                    <div class="item-title">${I}</div>
                                    <div class="item-desc">${xe} &bull; Custom Tech Deliverable</div>
                                </td>
                                <td style="text-align: center; font-weight: 700; font-family: 'JetBrains Mono', monospace;">1</td>
                                <td style="text-align: right; font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${N}</td>
                                <td style="text-align: right; font-weight: 800; font-family: 'JetBrains Mono', monospace;">৳${N}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="totals-container">
                        <div class="totals-box">
                            <div class="totals-row">
                                <span>Subtotal:</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳${N} BDT</span>
                            </div>
                            <div class="totals-row">
                                <span>VAT / Tax (0%):</span>
                                <span style="font-weight: 700; font-family: 'JetBrains Mono', monospace;">৳0.00 BDT</span>
                            </div>
                            <div class="grand-total">
                                <span>Grand Total:</span>
                                <span style="font-family: 'JetBrains Mono', monospace;">৳${N} BDT</span>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing <strong>IT SOLUTIONS</strong>. For any inquiries, contact support@itsolutions.com.</p>
                        <p style="margin-top: 4px; font-size: 10px; color: #cbd5e1;">Generated electronically &bull; Valid without signature</p>
                    </div>
                </div>
            </body>
            </html>
        `),a.document.close(),a.focus(),setTimeout(()=>{a.print()},350)},ce=t=>{if(!t)return;const a=`Invoice Reference: ${t.transaction_id||t.id}
Client: ${t.client?.name||t.user?.name}
Project: ${t.project_name||t.item?.name}
Total: ৳${parseFloat(t.amount).toLocaleString()} BDT
Status: ${t.status.toUpperCase()}`;navigator.clipboard.writeText(a),L(!0),setTimeout(()=>L(!1),2e3)},V=Q.filter(t=>{if(!k)return!0;const a=k.toLowerCase(),l=t.client?.name||t.user?.name||"",r=t.client?.phone||t.user?.phone||"",P=t.project_name||"",I=t.added_by||"";return l.toLowerCase().includes(a)||r.toLowerCase().includes(a)||P.toLowerCase().includes(a)||I.toLowerCase().includes(a)||(t.item?.name||"").toLowerCase().includes(a)});return e.jsxs(me,{title:"Orders",children:[e.jsxs("div",{className:"space-y-4 max-w-7xl mx-auto pb-8",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h1",{className:"font-black text-2xl sm:text-3xl text-slate-900 tracking-tight",children:"Orders"}),e.jsxs("button",{onClick:ae,className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs active:scale-95",children:[e.jsx(be,{className:"w-4 h-4"}),e.jsx("span",{children:"Add Order"})]})]}),e.jsxs("div",{className:"p-3 rounded-2xl bg-white border border-blue-100 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs",children:[e.jsxs("div",{className:"relative w-full md:w-80",children:[e.jsx(ue,{className:"w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"}),e.jsx("input",{type:"text",value:k,onChange:t=>X(t.target.value),placeholder:"Search client, project, phone, added by...",className:"w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-blue-500"})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end",children:[e.jsxs("div",{className:"flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs",children:[e.jsx(fe,{className:"w-3.5 h-3.5 text-slate-400 flex-shrink-0"}),e.jsx("span",{className:"text-[11px] text-slate-500 font-medium",children:"From:"}),e.jsx("input",{type:"date",value:D,onChange:t=>F(t.target.value,_),className:"bg-transparent border-0 p-0 text-xs text-slate-800 font-mono focus:ring-0 cursor-pointer"})]}),e.jsxs("div",{className:"flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs",children:[e.jsx("span",{className:"text-[11px] text-slate-500 font-medium",children:"To:"}),e.jsx("input",{type:"date",value:_,onChange:t=>F(D,t.target.value),className:"bg-transparent border-0 p-0 text-xs text-slate-800 font-mono focus:ring-0 cursor-pointer"})]}),(D||_)&&e.jsx("button",{onClick:Z,className:"p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors",title:"Reset Date Filter",children:e.jsx(ge,{className:"w-3.5 h-3.5"})})]})]}),e.jsx("div",{className:"bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-xs",children:e.jsx("div",{className:"overflow-x-auto w-full",children:e.jsxs("table",{className:"w-full min-w-[920px] text-left text-xs",children:[e.jsx("thead",{className:"text-slate-500 uppercase border-b border-blue-100 bg-slate-50 text-[10px] font-mono",children:e.jsxs("tr",{children:[e.jsx("th",{className:"py-3 pl-5 pr-3 whitespace-nowrap",children:"Date"}),e.jsx("th",{className:"py-3 px-3",children:"Client"}),e.jsx("th",{className:"py-3 px-3 whitespace-nowrap",children:"Contact"}),e.jsx("th",{className:"py-3 px-3",children:"Project"}),e.jsx("th",{className:"py-3 px-3 whitespace-nowrap",children:"Amount"}),e.jsx("th",{className:"py-3 px-3 w-36",children:"Status & Progress"}),e.jsx("th",{className:"py-3 px-3 whitespace-nowrap",children:"Added By"}),e.jsx("th",{className:"py-3 pl-3 pr-6 text-right whitespace-nowrap",children:"Actions"})]})}),e.jsx("tbody",{className:"divide-y divide-blue-50 text-slate-700",children:V.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"8",className:"p-8 text-center text-slate-400",children:'No orders found for the selected date range. Click "Add Order" to create one.'})}):V.map(t=>{const a=t.client?.name||t.user?.name||"Customer",l=t.client?.phone||t.user?.phone||"",r=t.progress??(t.status==="completed"?100:t.status==="processing"?50:t.status==="paid"?25:0);return e.jsxs("tr",{className:"hover:bg-blue-50/40 transition-colors",children:[e.jsxs("td",{className:"py-3 pl-5 pr-3 whitespace-nowrap",children:[e.jsx("p",{className:"font-mono text-slate-900 font-bold text-xs",children:new Date(t.created_at).toLocaleDateString()}),e.jsx("p",{className:"text-[10px] text-slate-400 font-mono",children:new Date(t.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})})]}),e.jsx("td",{className:"py-3 px-3",children:e.jsx("p",{className:"font-bold text-slate-900 text-xs",children:a})}),e.jsx("td",{className:"py-3 px-3 whitespace-nowrap",children:l?e.jsx("span",{className:"font-mono text-slate-700 font-medium text-xs",children:l}):e.jsx("span",{className:"text-slate-400 text-xs",children:"—"})}),e.jsxs("td",{className:"py-3 px-3",children:[e.jsx("p",{className:"font-bold text-slate-900 text-xs",children:t.project_name||t.item?.name||"Project"}),t.item?.name&&e.jsx("p",{className:"text-[10px] text-slate-400",children:t.item.name})]}),e.jsxs("td",{className:"py-3 px-3 whitespace-nowrap",children:[e.jsxs("p",{className:"font-mono font-bold text-emerald-600 text-xs",children:["৳",parseFloat(t.amount).toLocaleString()]}),e.jsx("span",{className:"text-[10px] text-slate-400",children:t.payment_method||"Online"})]}),e.jsx("td",{className:"py-3 px-3",children:e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex items-center justify-between text-[10px]",children:[e.jsx("span",{className:`px-2 py-0.2 rounded-full font-bold capitalize ${t.status==="completed"||t.status==="paid"?"bg-emerald-50 text-emerald-700":t.status==="processing"?"bg-blue-50 text-blue-700":t.status==="cancelled"?"bg-red-50 text-red-700":"bg-amber-50 text-amber-700"}`,children:t.status}),e.jsxs("span",{className:"font-mono font-bold text-slate-700",children:[r,"%"]})]}),e.jsx("div",{className:"w-full h-1.5 bg-slate-100 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full transition-all duration-300 rounded-full ${r>=100?"bg-emerald-500":r>=50?"bg-blue-500":r>=25?"bg-indigo-500":"bg-amber-500"}`,style:{width:`${r}%`}})})]})}),e.jsx("td",{className:"py-3 px-3 whitespace-nowrap",children:e.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold",children:[e.jsx(je,{className:"w-3 h-3 text-slate-500 flex-shrink-0"}),e.jsx("span",{children:t.added_by||"Admin"})]})}),e.jsx("td",{className:"py-3 pl-3 pr-6 text-right whitespace-nowrap",children:e.jsx(he,{label:"Actions",children:e.jsxs("div",{className:"py-1",children:[e.jsx(g,{onClick:()=>ne(t),icon:R,className:"text-emerald-700 hover:text-emerald-800",children:"Payment"}),e.jsx(g,{onClick:()=>le(t),icon:J,className:"text-blue-700 hover:text-blue-800",children:"Progress"}),e.jsx(g,{onClick:()=>v(t),icon:W,className:"text-slate-700 hover:text-slate-900",children:"View"}),e.jsx(g,{onClick:()=>S(t),icon:De,className:"text-indigo-700 hover:text-indigo-800",children:"Invoice"}),e.jsx(g,{onClick:()=>ee(t),icon:Se,danger:!0,children:"Cancel"})]})})})]},t.id)})})]})})})]}),e.jsx(f,{show:Y,onClose:()=>h(!1),maxWidth:"md",children:e.jsxs("div",{className:"bg-white p-5 space-y-4 rounded-2xl text-slate-800",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-100",children:[e.jsx("h2",{className:"font-bold text-base text-slate-900",children:"Add Order"}),e.jsx("button",{type:"button",onClick:()=>h(!1),className:"p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100",children:e.jsx(w,{className:"w-5 h-5"})})]}),e.jsxs("form",{onSubmit:oe,className:"space-y-3 text-xs",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Customer / Client *"}),e.jsxs("select",{value:c.client_id,onChange:t=>x("client_id",t.target.value),className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500 font-semibold",required:!0,children:[e.jsx("option",{value:"",children:"-- Select Client --"}),C.map(t=>e.jsxs("option",{value:t.id,children:[t.name," ",t.phone?`(${t.phone})`:""]},t.id))]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2.5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Project Name"}),e.jsx("input",{type:"text",value:c.project_name,onChange:t=>x("project_name",t.target.value),placeholder:"Project Name",className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Service Offering *"}),e.jsxs("select",{value:c.item_id,onChange:t=>{const a=j.find(l=>l.id==t.target.value);x(l=>({...l,item_id:t.target.value,project_name:l.project_name||(a?a.name:"")}))},className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-500",required:!0,children:[e.jsx("option",{value:"",children:"-- Select Service --"}),j.map(t=>e.jsx("option",{value:t.id,children:t.name},t.id))]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2.5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Amount (৳ BDT) *"}),e.jsx("input",{type:"number",step:"0.01",value:c.amount,onChange:t=>x("amount",t.target.value),placeholder:"Amount",className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Payment Method"}),e.jsx("select",{value:c.payment_method,onChange:t=>x("payment_method",t.target.value),className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900",children:q.map(t=>e.jsx("option",{value:t,children:t},t))})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2.5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Status"}),e.jsxs("select",{value:c.status,onChange:t=>{const a=t.target.value;x(l=>({...l,status:a,progress:a==="completed"?100:a==="processing"?50:a==="paid"?25:0}))},className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900",children:[e.jsx("option",{value:"pending",children:"Pending"}),e.jsx("option",{value:"processing",children:"Processing"}),e.jsx("option",{value:"paid",children:"Paid"}),e.jsx("option",{value:"completed",children:"Completed"})]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("label",{className:"block text-slate-700 font-bold",children:"Progress"}),e.jsxs("span",{className:"font-mono font-bold text-blue-600",children:[c.progress,"%"]})]}),e.jsx("input",{type:"range",min:"0",max:"100",step:"5",value:c.progress,onChange:t=>x("progress",parseInt(t.target.value)),className:"w-full accent-blue-600 cursor-pointer"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100",children:[e.jsx("button",{type:"button",onClick:()=>h(!1),className:"px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:se,className:"px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs active:scale-95 transition-all",children:"Save"})]})]})]})}),e.jsx(f,{show:!!d,onClose:()=>b(null),maxWidth:"sm",children:d&&e.jsxs("div",{className:"bg-white p-5 space-y-4 rounded-2xl text-slate-800",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-100",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(J,{className:"w-5 h-5 text-blue-600"}),e.jsx("h2",{className:"font-bold text-base text-slate-900",children:"Edit Progress"})]}),e.jsx("button",{onClick:()=>b(null),className:"p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100",children:e.jsx(w,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100",children:[e.jsx("p",{className:"truncate",children:d.project_name||d.item?.name}),e.jsx("p",{className:"text-[11px] text-slate-500 font-normal mt-0.5 truncate",children:d.client?.name||d.user?.name})]}),e.jsxs("form",{onSubmit:re,className:"space-y-4 text-xs",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"block text-slate-700 font-bold",children:"Progress Percentage"}),e.jsxs("span",{className:"font-mono font-black text-blue-600 text-base",children:[p.data.progress,"%"]})]}),e.jsx("input",{type:"range",min:"0",max:"100",step:"5",value:p.data.progress,onChange:t=>p.setData("progress",parseInt(t.target.value)),className:"w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"}),e.jsx("div",{className:"grid grid-cols-5 gap-1 pt-3",children:[0,25,50,75,100].map(t=>e.jsxs("button",{type:"button",onClick:()=>p.setData("progress",t),className:`py-1 px-1 rounded-lg text-center font-mono font-bold text-[10px] border transition-all ${p.data.progress===t?"bg-blue-600 text-white border-blue-600 shadow-2xs":"bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`,children:[t,"%"]},t))})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-slate-100",children:[e.jsx("button",{type:"button",onClick:()=>b(null),className:"px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:p.processing,className:"px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs active:scale-95 transition-all",children:"Save"})]})]})]})}),e.jsx(f,{show:!!o,onClose:()=>u(null),maxWidth:"sm",children:o&&e.jsxs("div",{className:"bg-white p-5 space-y-4 rounded-2xl text-slate-800",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-100",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(R,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h2",{className:"font-bold text-base text-slate-900",children:"Payment Details"})]}),e.jsx("button",{onClick:()=>u(null),className:"p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100",children:e.jsx(w,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-bold text-slate-900",children:o.client?.name||"Customer"}),e.jsx("p",{className:"text-[11px] text-slate-500 font-mono",children:o.project_name||o.item?.name})]}),e.jsxs("div",{className:"text-right",children:[e.jsxs("p",{className:"font-mono font-black text-sm text-emerald-600",children:["৳",parseFloat(o.amount).toLocaleString()]}),e.jsx("span",{className:`px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${o.status==="paid"?"bg-emerald-50 text-emerald-700":"bg-amber-50 text-amber-700"}`,children:o.status})]})]}),e.jsxs("form",{onSubmit:ie,className:"space-y-3.5 text-xs",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Payment Status"}),e.jsxs("select",{value:m.data.status,onChange:t=>m.setData("status",t.target.value),className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold",children:[e.jsx("option",{value:"paid",children:"Paid (Mark Settled)"}),e.jsx("option",{value:"pending",children:"Pending (Unpaid)"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-slate-700 font-bold mb-1",children:"Payment Gateway / Method"}),e.jsx("select",{value:m.data.payment_method,onChange:t=>m.setData("payment_method",t.target.value),className:"w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900",children:q.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2 pt-2 border-t border-slate-100",children:[e.jsx("button",{type:"button",onClick:()=>u(null),className:"px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:m.processing,className:"px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs active:scale-95 transition-all",children:"Update Payment"})]})]})]})}),e.jsx(f,{show:!!n,onClose:()=>v(null),maxWidth:"md",children:n&&e.jsxs("div",{className:"bg-white p-5 space-y-4 rounded-2xl text-slate-800",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-100",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(W,{className:"w-5 h-5 text-blue-600"}),e.jsx("h2",{className:"font-bold text-base text-slate-900",children:"Order Details"})]}),e.jsx("button",{onClick:()=>v(null),className:"p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100",children:e.jsx(w,{className:"w-4 h-4"})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 text-xs",children:[e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"Customer"}),e.jsx("p",{className:"font-bold text-slate-900",children:n.client?.name||n.user?.name}),e.jsx("p",{className:"text-slate-500 font-mono text-[11px]",children:n.client?.phone||n.user?.phone||"—"})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"Amount & Status"}),e.jsxs("p",{className:"font-bold font-mono text-emerald-600",children:["৳",parseFloat(n.amount).toLocaleString()]}),e.jsxs("p",{className:"text-slate-500 text-[11px] capitalize",children:[n.status," • ",n.payment_method]})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 col-span-2",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"Project / Deliverable"}),e.jsx("p",{className:"font-bold text-slate-900",children:n.project_name||n.item?.name}),e.jsx("p",{className:"text-slate-500 text-[11px]",children:n.item?.name})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"Progress"}),e.jsxs("p",{className:"font-bold font-mono text-blue-600",children:[n.progress??0,"%"]})]}),e.jsxs("div",{className:"p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 uppercase",children:"Created Timeline"}),e.jsx("p",{className:"font-mono text-slate-700",children:new Date(n.created_at).toLocaleDateString()}),e.jsxs("p",{className:"text-slate-400 text-[10px]",children:["By ",n.added_by||"Admin"]})]})]}),e.jsx("div",{className:"flex justify-end pt-2 border-t border-slate-100",children:e.jsx("button",{onClick:()=>v(null),className:"px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs",children:"Close"})})]})}),e.jsx(f,{show:!!s,onClose:()=>S(null),maxWidth:"lg",children:s&&e.jsxs("div",{className:"bg-white p-6 sm:p-8 space-y-6 rounded-2xl text-slate-800",children:[e.jsxs("div",{className:"space-y-6 bg-white",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("div",{className:"w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center",children:"IT"}),e.jsx("h3",{className:"font-black text-xl text-slate-900 tracking-tight",children:"IT SOLUTIONS"})]}),e.jsx("p",{className:"text-xs text-slate-500 font-medium",children:"Digital Agency & Software Engineering"}),e.jsxs("div",{className:"text-[11px] text-slate-400 font-mono mt-2 space-y-0.5",children:[e.jsx("p",{children:"Dhaka, Bangladesh • Hotline: +880 1800-000000"}),e.jsx("p",{children:"support@itsolutions.com • www.itsolutions.com"})]})]}),e.jsxs("div",{className:"sm:text-right space-y-2",children:[e.jsx("div",{className:`inline-block px-3 py-1 rounded-lg font-mono font-black text-xs uppercase tracking-wider border ${s.status==="paid"?"bg-emerald-50 text-emerald-700 border-emerald-300":"bg-amber-50 text-amber-700 border-amber-300"}`,children:s.status==="paid"?"✓ PAID & SETTLED":"⏳ PENDING INVOICE"}),e.jsx("h2",{className:"font-black text-2xl text-slate-900 tracking-tight",children:"INVOICE"}),e.jsxs("p",{className:"font-mono font-bold text-xs text-blue-600",children:["#",s.transaction_id||`INV-${s.id.toString().padStart(6,"0")}`]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-wider text-slate-400 block",children:"Billed To"}),e.jsx("h4",{className:"font-bold text-sm text-slate-900",children:s.client?.name||s.user?.name}),s.client?.contact_person&&e.jsx("p",{className:"text-slate-600 font-medium",children:s.client.contact_person}),e.jsx("p",{className:"text-slate-500 font-mono",children:s.client?.phone||s.user?.phone||"—"})]}),e.jsxs("div",{className:"space-y-1 sm:text-right",children:[e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-wider text-slate-400 block",children:"Invoice Details"}),e.jsxs("p",{className:"text-slate-700",children:[e.jsx("span",{className:"text-slate-400",children:"Issue Date:"})," ",e.jsx("span",{className:"font-mono font-bold",children:new Date(s.created_at).toLocaleDateString()})]}),e.jsxs("p",{className:"text-slate-700",children:[e.jsx("span",{className:"text-slate-400",children:"Payment Method:"})," ",e.jsx("span",{className:"font-bold text-slate-900",children:s.payment_method||"Online"})]}),e.jsxs("p",{className:"text-slate-700",children:[e.jsx("span",{className:"text-slate-400",children:"Added By:"})," ",e.jsx("span",{className:"font-semibold text-slate-700",children:s.added_by||"Admin"})]})]})]}),e.jsx("div",{className:"overflow-hidden rounded-xl border border-slate-200",children:e.jsxs("table",{className:"w-full text-left text-xs",children:[e.jsx("thead",{className:"bg-slate-100/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3",children:"#"}),e.jsx("th",{className:"p-3",children:"Project / Deliverable"}),e.jsx("th",{className:"p-3 text-center",children:"Qty"}),e.jsx("th",{className:"p-3 text-right",children:"Price"}),e.jsx("th",{className:"p-3 text-right",children:"Total"})]})}),e.jsx("tbody",{className:"divide-y divide-slate-100",children:e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-mono text-slate-400",children:"01"}),e.jsxs("td",{className:"p-3",children:[e.jsx("p",{className:"font-bold text-slate-900 text-sm",children:s.project_name||s.item?.name||"Custom Software Development"}),e.jsxs("p",{className:"text-[11px] text-slate-500 mt-0.5",children:[s.item?.name," • Enterprise Solution"]})]}),e.jsx("td",{className:"p-3 text-center font-mono font-bold text-slate-700",children:"1"}),e.jsxs("td",{className:"p-3 text-right font-mono font-bold text-slate-700",children:["৳",parseFloat(s.amount).toLocaleString(void 0,{minimumFractionDigits:2})]}),e.jsxs("td",{className:"p-3 text-right font-mono font-bold text-slate-900",children:["৳",parseFloat(s.amount).toLocaleString(void 0,{minimumFractionDigits:2})]})]})})]})}),e.jsx("div",{className:"flex justify-end",children:e.jsxs("div",{className:"w-full sm:w-64 space-y-2 text-xs",children:[e.jsxs("div",{className:"flex justify-between py-1 border-b border-slate-100 text-slate-600",children:[e.jsx("span",{children:"Subtotal:"}),e.jsxs("span",{className:"font-mono font-bold text-slate-900",children:["৳",parseFloat(s.amount).toLocaleString(void 0,{minimumFractionDigits:2})," BDT"]})]}),e.jsxs("div",{className:"flex justify-between py-1 border-b border-slate-100 text-slate-600",children:[e.jsx("span",{children:"VAT / Tax (0%):"}),e.jsx("span",{className:"font-mono font-bold text-slate-900",children:"৳0.00 BDT"})]}),e.jsxs("div",{className:"flex justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-sm",children:[e.jsx("span",{className:"font-bold text-slate-900",children:"Grand Total:"}),e.jsxs("span",{className:"font-mono font-black text-blue-600",children:["৳",parseFloat(s.amount).toLocaleString(void 0,{minimumFractionDigits:2})," BDT"]})]})]})})]}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsxs("button",{type:"button",onClick:()=>de(s),className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 text-xs transition-colors shadow-xs active:scale-95 cursor-pointer",children:[e.jsx(ve,{className:"w-4 h-4"}),e.jsx("span",{children:"Print & Save PDF"})]}),e.jsxs("button",{type:"button",onClick:()=>ce(s),className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors shadow-2xs cursor-pointer",children:[A?e.jsx(Ne,{className:"w-4 h-4 text-emerald-600"}):e.jsx(ye,{className:"w-4 h-4 text-slate-600"}),e.jsx("span",{children:A?"Copied!":"Copy Summary"})]}),(s.client?.phone||s.user?.phone)&&e.jsxs("button",{type:"button",onClick:()=>{let a=(s.client?.phone||s.user?.phone).replace(/[^0-9+]/g,"");a.startsWith("01")&&(a="880"+a.substring(1)),a.startsWith("+")&&(a=a.replace("+",""));const l=encodeURIComponent(`Hello ${s.client?.name||"Customer"},

Here is your Invoice #${s.transaction_id||s.id} for "${s.project_name||s.item?.name}".

Total Amount: ৳${parseFloat(s.amount).toLocaleString()} BDT
Status: ${s.status.toUpperCase()}

Thank you for choosing IT SOLUTIONS!`);window.open(`https://wa.me/${a}?text=${l}`,"_blank")},className:"inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 text-xs transition-colors shadow-2xs cursor-pointer",children:[e.jsx(we,{className:"w-4 h-4 text-emerald-600"}),e.jsx("span",{children:"Send WhatsApp"})]})]}),e.jsx("button",{type:"button",onClick:()=>S(null),className:"px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition-colors cursor-pointer",children:"Close"})]})]})})]})}export{lt as default};
