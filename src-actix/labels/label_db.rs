use crate::label_data::{LabelCategory, LabelData};
use anyhow::Result;
use database_common_lib::database_connection::{create_pool, DatabaseConnectionData};
use sqlx::Executor;

pub async fn initialize_db(data: &DatabaseConnectionData) ->Result<()>
{
	let pool = create_pool(data).await?;
	
	pool.execute(
		r#"
CREATE TABLE IF NOT EXISTS `tag_labels` (
    id  INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    category TINYINT UNSIGNED NOT NULL 
);
"#
		).await?;
	
	pool.close().await;
	Ok(())
}

pub async fn get_by_category(data:&DatabaseConnectionData, category: LabelCategory) -> Result<Vec<LabelData>> {
	let pool = create_pool(data).await?;
	let result  = sqlx::query_as::<_, LabelData>("SELECT * FROM tag_labels WHERE category = ?").bind(category).fetch_all(&pool).await?;
	
	pool.close().await;
	Ok(result)
}