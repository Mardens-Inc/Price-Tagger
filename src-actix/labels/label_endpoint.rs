use crate::label_data::{DepartmentResult, StickerResult};
use crate::{label_data, label_db};
use actix_web::{get, web, HttpResponse, Responder};
use database_common_lib::database_connection::DatabaseConnectionData;
use database_common_lib::http_error::Result;

#[get("/departments")]
async fn get_departments(data: web::Data<DatabaseConnectionData>) -> Result<impl Responder> {
    let data = data.as_ref();
    let label = label_db::get_by_category(data, label_data::LabelCategory::Department)
        .await?
        .into_iter()
        .map(DepartmentResult::from)
        .collect::<Vec<DepartmentResult>>();
    Ok(HttpResponse::Ok().json(label))
}
#[get("/labels")]
async fn get_labels(data: web::Data<DatabaseConnectionData>) -> Result<impl Responder> {
    let data = data.as_ref();
    let label = label_db::get_by_category(data, label_data::LabelCategory::Label)
        .await?
        .into_iter()
        .map(|i| i.value)
        .collect::<Vec<String>>();
    Ok(HttpResponse::Ok().json(label))
}
#[get("/colors")]
async fn get_colors(data: web::Data<DatabaseConnectionData>) -> Result<impl Responder> {
    let data = data.as_ref();
    let label = label_db::get_by_category(data, label_data::LabelCategory::Color)
        .await?
        .into_iter()
        .map(|i| i.value)
        .collect::<Vec<String>>();
    Ok(HttpResponse::Ok().json(label))
}
#[get("/stickers")]
async fn get_stickers(data: web::Data<DatabaseConnectionData>) -> Result<impl Responder> {
    let data = data.as_ref();
    let label = label_db::get_by_category(data, label_data::LabelCategory::Sticker)
        .await?
        .into_iter()
        .map(StickerResult::from)
        .collect::<Vec<StickerResult>>();
    Ok(HttpResponse::Ok().json(label))
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .service(get_departments)
            .service(get_labels)
            .service(get_colors)
            .service(get_stickers),
    );
}
