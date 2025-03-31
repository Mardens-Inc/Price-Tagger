use actix_web::web;
use anyhow::Result;
use database_common_lib::actix_extension::create_http_server;
use database_common_lib::database_connection::DatabaseConnectionData;
use database_common_lib::set_database_name;
use include_dir::include_dir;
use log::*;
use vite_actix::start_vite_server;

#[path = "labels/label_data.rs"]
mod label_data;
#[path = "labels/label_db.rs"]
mod label_db;
#[path = "labels/label_endpoint.rs"]
mod label_endpoint;

pub static DEBUG: bool = cfg!(debug_assertions);
const PORT: u16 = 1421;

pub async fn run() -> Result<()> {
    env_logger::builder()
        .filter_level(LevelFilter::Debug)
        .init();
    
    set_database_name!("pricing");
    std::env::set_var("DATABASE", "pricing");
    let data = DatabaseConnectionData::get().await?;
    label_db::initialize_db(&data).await?;

    let server = create_http_server(
        move || {
            let data = data.clone();
            Box::new(move |cfg| {
                let data = web::Data::new(data);
                cfg.service(
                    web::scope("/api")
                        .app_data(data.clone())
                        .configure(label_endpoint::configure)
                );
            })
        },
        include_dir!("target/wwwroot"),
        PORT,
    )?;

    info!(
        "Starting {} server at http://127.0.0.1:{}...",
        if DEBUG { "development" } else { "production" },
        PORT
    );

    if DEBUG {
        start_vite_server().expect("Failed to start vite server");
    }

    let stop_result = server.await;
    debug!("Server stopped");

    Ok(stop_result?)
}
