import { Entity, PrimaryColumn, BaseEntity } from "typeorm"

@Entity({
  withoutRowid: true,
})
export class BotDialogEntity extends BaseEntity {
  @PrimaryColumn()
  chatId!: string

  @PrimaryColumn()
  botId!: string
}
