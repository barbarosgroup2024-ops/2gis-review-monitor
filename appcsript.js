// ========================
// Настройки
// ========================
const SHEET_NAME = "2GIS"; // без пробела
const TWO_GIS_API_URL = "https://public-api.reviews.2gis.com/3.0/orgs/70000001024523370/reviews?limit=50&fields=meta.org_rating,meta.org_reviews_count,meta.total_count,reviews.object.address,reviews.hiding_reason&without_my_first_review=false&rated=true&sort_by=friends&key=6e7e1929-4ea9-4a5d-8c05-d601860389bd&locale=ru_KG";

// ========================
// Основная функция
// ========================
function fetchAndUpdate2GIS() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;

  const response = UrlFetchApp.fetch(TWO_GIS_API_URL, { muteHttpExceptions: true });
  const data = JSON.parse(response.getContentText());
  if (!data.reviews || data.reviews.length === 0) {
    Logger.log("Нет новых отзывов с 2GIS");
    return;
  }

  // Считываем существующие отзывы для проверки уникальности
  let existingTexts = [];
  if (sheet.getLastRow() > 1) {
    existingTexts = sheet.getRange(2, 7, sheet.getLastRow() - 1, 1)
                         .getValues()
                         .flat()
                         .map(t => (t || "").trim());
  }

  const newReviews = [];

  data.reviews.forEach(review => {
    const reviewText = review.text || "";
    if (!existingTexts.includes(reviewText.trim())) {
      const created = review.date_created ? new Date(review.date_created) : "";
      newReviews.push([
        review.id,                                           // ID из 2GIS
        created ? Utilities.formatDate(created, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") : "", // Дата создания
        review.date_edited ? Utilities.formatDate(new Date(review.date_edited), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss") : "", // Дата редактирования
        review.user?.name || "",                             // Пользователь
        review.object?.address || "",                        // Адрес
        review.rating || "",                                  // Рейтинг
        reviewText                                           // Текст отзыва
      ]);
    }
  });

  if (newReviews.length > 0) {
    // Сортируем по дате (свежие сверху)
    newReviews.sort((a, b) => new Date(b[1]) - new Date(a[1]));

    // Если лист пустой, добавляем заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "Дата", "Дата редактирования", "Пользователь", "Адрес", "Рейтинг", "Отзыв"]);
    }

    // Вставляем новые отзывы сверху
    sheet.insertRowsAfter(1, newReviews.length);
    sheet.getRange(2, 1, newReviews.length, newReviews[0].length).setValues(newReviews);

    Logger.log(`Добавлено ${newReviews.length} новых отзывов с 2GIS`);
  } else {
    Logger.log("Новых отзывов нет или они уже есть в таблице");
  }
}
