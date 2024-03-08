// id                String               @id @default(uuid())
// price             Int
// articleModifierId String
// menuId            String

export interface ArticleModifierPrice {
    id: string
    price: number
    articleModifierId: string
    menuId: string
    }
    