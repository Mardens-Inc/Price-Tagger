#[actix_web::main]
async fn main()->anyhow::Result<()>{tagpricer_lib::run().await}