import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { StockEntity } from "./Stock"

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text', nullable: false })
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'float' })
    price: number

    @OneToOne(() => StockEntity)
    @JoinColumn({ name: 'id', referencedColumnName: 'product_id' })
    stock: StockEntity;
}
