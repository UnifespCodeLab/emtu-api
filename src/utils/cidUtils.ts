import CidsRepository from "../models/repositories/implementations/CidsRepository";
import { PostgresCidsDataSource } from "../database/db/cids/potsgresCidsDataSource";

const cidsDatasource = new PostgresCidsDataSource();
const cidsRepository = new CidsRepository(cidsDatasource);

export function getAdaptionPriority(group: string) {
    switch (group) {
        case 'G1':
            return 1;
        case 'G2':
            return 2;
        case 'G3':
            return 3;
        default:
            console.warn(`Unknown group: ${group}`);
            return 3;
    }
}

export class getPrimaryAdaption {
    static async execute(cids: number[]): Promise<number> {
        const cidDetails = await cidsRepository.findByIds(cids);

        const sortedCids = cidDetails.sort((a, b) => {
            const priorityA = this.getAdaptationPriority(a.group);
            const priorityB = this.getAdaptationPriority(b.group);
            return priorityA - priorityB;
        });
        return sortedCids[0].id;
    }

    private static getAdaptationPriority(group: string): number {
        switch (group) {
            case 'G1':
                return 1;
            case 'G2':
                return 2;
            case 'G3':
                return 3;
            default:
                console.warn(`Unknown group: ${group}`);
                return 3; 
        }
    }
}
