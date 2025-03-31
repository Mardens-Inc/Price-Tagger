use serde::{Deserialize, Serialize};
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::{Database, Decode, Encode, FromRow, MySql, Type, ValueRef};

#[derive(Serialize)]
pub struct DepartmentResult {
    pub id: u32,
    pub name: String,
}

#[derive(Serialize)]
pub struct StickerResult {
    pub name: String,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromRow)]
pub struct LabelData {
    pub id: u32,
    pub value: String,
    pub category: LabelCategory,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
#[repr(u8)]
pub enum LabelCategory {
    Department,
    Label,
    Color,
    Sticker,
}

impl Encode<'_, MySql> for LabelCategory {
    fn encode(
        self,
        buf: &mut <MySql as Database>::ArgumentBuffer<'_>,
    ) -> Result<IsNull, BoxDynError>
    where
        Self: Sized,
    {
        let value = self as u8;
        <u8 as Encode<MySql>>::encode(value, buf)
    }

    fn encode_by_ref(
        &self,
        buf: &mut <MySql as Database>::ArgumentBuffer<'_>,
    ) -> Result<IsNull, BoxDynError> {
        let value = self.clone() as u8;
        <u8 as Encode<MySql>>::encode(value, buf)
    }
}

impl Decode<'_, MySql> for LabelCategory {
    fn decode(value: <MySql as Database>::ValueRef<'_>) -> Result<Self, BoxDynError> {
        if value.is_null() {
            return Err("LabelCategory is null".into());
        }
        if u8::compatible(&value.type_info()) {
            return match u8::decode(value)? {
                0 => Ok(Self::Department),
                1 => Ok(Self::Label),
                2 => Ok(Self::Color),
                3 => Ok(Self::Sticker),
                _ => Err("Invalid value for LabelCategory".into()),
            };
        }
        Err("Invalid value for LabelCategory".into())
    }
}

impl Type<MySql> for LabelCategory {
    fn type_info() -> <MySql as Database>::TypeInfo {
        u8::type_info()
    }

    fn compatible(ty: &<MySql as Database>::TypeInfo) -> bool {
        u8::compatible(ty)
    }
}

impl From<LabelData> for DepartmentResult {
    fn from(label: LabelData) -> Self {
        let (id, name) = label
            .value
            .split_once('-')
            .map_or((0, label.value.clone()), |(id_str, name)| {
                (id_str.parse().unwrap_or_default(), name.trim().to_string())
            });
        Self { id, name }
    }
}

impl From<LabelData> for StickerResult {
    fn from(value: LabelData) -> Self {
        // ex: Orange (0.8in x 0.5in)
        use regex::Regex;

        let re = Regex::new(r"^(.*?)\s*\((\d+\.?\d*)in\s*x\s*(\d+\.?\d*)in\)$").unwrap();
        let captures = match re.captures(&value.value) {
            Some(cap) => cap,
            None => {
                return Self {
                    name: String::new(),
                    width: 0.0,
                    height: 0.0,
                }
            }
        };
        let name = captures
            .get(1)
            .map_or("", |m| m.as_str().trim())
            .to_string();
        let width = captures.get(2).map_or(0.0, |m| {
            m.as_str().trim().parse::<f32>().unwrap_or_default()
        });
        let height = captures.get(3).map_or(0.0, |m| {
            m.as_str().trim().parse::<f32>().unwrap_or_default()
        });
        Self {
            name,
            width,
            height,
        }
    }
}
