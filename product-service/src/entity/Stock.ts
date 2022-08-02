import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { ProductEntity } from "./Product";

@Entity('stocks')
export class StockEntity {
    @PrimaryColumn({ type: 'uuid', nullable: false })
    product_id: string

    @Column({ type: 'integer' })
    count: number

    @OneToOne(() => ProductEntity)
    @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
    product: ProductEntity;
}
