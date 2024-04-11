
export interface PayMethod {
  id: string
  name: string
  accountId: string
  active: boolean
  commission: number
  isPublic: boolean
  isSemiPublic: boolean
}
