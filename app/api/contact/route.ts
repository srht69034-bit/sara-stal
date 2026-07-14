import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SESSION_LABELS: Record<string, string> = {
  chalakah: "חאלקה",
  newborn: "ניובורן",
  "smash-cake": "סמאש קייק",
  outdoor: "חוץ",
  studio: "סטודיו",
  other: "אחר",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/**
 * מייל התודה האוטומטי - בנוי מהתוכן שנשלח (ברכה, סיפור אישי, הצצה
 * לגלריות, מבצע השקה עם דחיפות, וחתימה). מעוצב בקו האתר הנוכחי
 * (שמנת/אפור-חום/ירוק-זית, Georgia כתחליף ל-Frank Ruhl Libre שלא
 * זמין במיילים). אם יש לך עיצוב חזותי אחר (צבעים/תמונות) שכבר בנית -
 * אפשר לשלוח לי כתמונה/PDF/HTML ואחליף כאן.
 */
function autoReplyHtml(name: string) {
  const galleries = [
    { label: "גלריית חאלקה", href: `${SITE_URL}/gallery/chalakah` },
    { label: "גלריית סטודיו", href: `${SITE_URL}/gallery/studio` },
    { label: "גלריית חוץ", href: `${SITE_URL}/gallery/outdoor` },
  ];

  const galleryLinksHtml = galleries
    .map(
      (g) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #E7E2D8;">
            <span style="font-size:15px;">${g.label}</span>
            <a href="${g.href}" style="float:left;color:#7A8172;font-size:13px;letter-spacing:0.05em;text-decoration:none;">לצפייה בתמונות ←</a>
          </td>
        </tr>`
    )
    .join("");

  return `
  <div style="background:#F9F7F2;padding:48px 20px;font-family:Assistant,Arial,sans-serif;color:#3D3A36;direction:rtl;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #E7E2D8;">

      <div style="padding:44px 36px 8px;text-align:center;">
        <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#8C8579;margin:0 0 28px;">S A R A H &nbsp;•&nbsp; S T A L</p>
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:24px;margin:0 0 12px;">תודה שפניתם אליי</h1>
        <p style="font-size:15px;line-height:1.8;color:#8C8579;margin:0;">בואו נתפוס רגע קטן, ונהפוך אותו לנצחי.</p>
      </div>

      <div style="padding:28px 36px 8px;">
        <p style="font-size:15px;line-height:1.85;margin:0 0 16px;">היי ${name}, ותודה על הפנייה!</p>
        <p style="font-size:15px;line-height:1.85;margin:0 0 16px;">
          אני שרי. אני מאמינה שכל משפחה היא סיפור, והתפקיד שלי הוא לתעד את הסיפור שלכם
          בצורה הכי טבעית, רכה ומדויקת שיש.
        </p>
        <p style="font-size:15px;line-height:1.85;margin:0;">
          אני מתמחה בצילומי ניו-בורן, ילדים ומשפחה - בסטודיו באווירה רגועה או בחיק הטבע,
          עם המון סבלנות ואור טבעי.
        </p>
      </div>

      <div style="padding:28px 36px;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8C8579;margin:0 0 12px;">הצצה לקסם</p>
        <table role="presentation" width="100%" style="border-collapse:collapse;">
          ${galleryLinksHtml}
        </table>
      </div>

      <div style="background:#F9F7F2;padding:32px 36px;margin:0;border-top:1px solid #E7E2D8;">
        <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7A8172;margin:0 0 10px;">הזדמנות אחרונה במחיר השקה</p>
        <p style="font-size:14px;line-height:1.8;color:#8C8579;margin:0 0 20px;">
          כדי לשמור על רמת האיכות והיחס האישי לכל משפחה, אני מקבלת מספר מוגבל של לקוחות
          בכל שבוע. בימים אלו אני מעדכנת את המחירון - זו ההזדמנות שלכם לשריין תאריך
          במחיר הנוכחי, לפני העלייה.
        </p>

        <div style="background:#ffffff;border:1px solid #E7E2D8;padding:20px 22px;margin-bottom:14px;">
          <p style="font-size:15px;font-weight:600;margin:0 0 4px;">
            חבילת הבסיס &nbsp;
            <span style="text-decoration:line-through;color:#8C8579;font-weight:400;">700 ₪</span>
            &nbsp; <span style="color:#7A8172;">500 ₪</span>
          </p>
          <p style="font-size:13px;line-height:1.8;color:#8C8579;margin:0;">
            כל התמונות מהצילום · +20 תמונות ערוכות ברמה מקצועית · כשעתיים וחצי של צילומים
            · התמונות מוכנות תוך שבועיים מהבחירה
          </p>
        </div>

        <div style="background:#ffffff;border:1px solid #E7E2D8;padding:20px 22px;margin-bottom:22px;">
          <p style="font-size:15px;font-weight:600;margin:0 0 4px;">
            חבילה מורחבת - 30 תמונות ערוכות &nbsp; <span style="color:#7A8172;">600 ₪</span>
          </p>
          <p style="font-size:13px;line-height:1.8;color:#8C8579;margin:0;">
            אותה חוויה מלאה, עם 30 תמונות ערוכות - כדי שלא תצטרכו לוותר על אף רגע.
          </p>
        </div>

        <a href="${SITE_URL}/#contact" style="display:inline-block;background:#7A8172;color:#F9F7F2;font-size:12px;letter-spacing:0.15em;text-decoration:none;padding:13px 26px;">
          לשריין לעצמכם תאריך לפני שהיומן מתמלא ←
        </a>
      </div>

      <div style="padding:28px 36px 40px;">
        <p style="font-size:14px;line-height:1.8;margin:0 0 20px;">
          אשמח לענות על כל שאלה ולהתאים לכם את החבילה המושלמת.
        </p>
        <p style="font-size:14px;line-height:1.8;margin:0;">שלך,<br/>שרי סטל · צילומי ילדים, משפחה וטבע</p>
      </div>

      <div style="border-top:1px solid #E7E2D8;padding:20px 36px;text-align:center;">
        <p style="font-size:12px;color:#8C8579;margin:0;">
          שרי סטל · צילומי ילדים, משפחה וטבע &nbsp;•&nbsp; טלפון: 055-674-9840
          &nbsp;•&nbsp; <a href="${SITE_URL}" style="color:#8C8579;">תיק עבודות</a>
        </p>
      </div>

    </div>
  </div>`;
}

function ownerNotificationHtml(fields: { name: string; email: string; sessionType?: string; message: string }) {
  const sessionLabel = fields.sessionType ? SESSION_LABELS[fields.sessionType] ?? fields.sessionType : "לא צוין";
  return `
  <div style="background:#F9F7F2;padding:40px 24px;font-family:Assistant,Arial,sans-serif;color:#3D3A36;direction:rtl;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E7E2D8;padding:32px;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#8C8579;margin:0 0 20px;">פנייה חדשה מהאתר</p>
      <p style="font-size:15px;line-height:1.9;margin:0;">
        <b>שם:</b> ${fields.name}<br/>
        <b>אימייל/טלפון:</b> ${fields.email}<br/>
        <b>סוג צילום:</b> ${sessionLabel}
      </p>
      <p style="font-size:15px;line-height:1.8;margin:20px 0 0;white-space:pre-wrap;">${fields.message}</p>
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  const { name, email, sessionType, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    // משתני הסביבה עדיין לא הוגדרו ב-Vercel - נכשל בעדינות במקום לקרוס.
    // (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL תחת Project > Settings > Environment Variables)
    console.error("contact form: missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL env vars");
    return NextResponse.json(
      { error: "email service not configured" },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    // 1) הודעה לבעלת האתר
    const ownerResult = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `פנייה חדשה מהאתר - ${name}`,
      html: ownerNotificationHtml({ name, email, sessionType, message }),
    });
    if (ownerResult.error) throw ownerResult.error;

    // 2) מענה אוטומטי מעוצב לפונה
    const replyResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "תודה שפניתם אליי - בואו נתפוס רגע קטן ונהפוך אותו לנצחי",
      html: autoReplyHtml(name),
    });
    if (replyResult.error) throw replyResult.error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    // שגיאה נפוצה: fromEmail חייב להיות מדומיין שאומת ב-Resend
    // (Resend > Domains) - אחרת השליחה נכשלת אפילו עם מפתח API תקין.
    console.error("contact form send error", err);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}
