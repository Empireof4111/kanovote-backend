import { Response } from 'express';
import { ExportService } from './export.service';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportSupportersCSV(res: Response, state?: string, lga?: string, status?: string): Promise<void>;
    exportAgentsCSV(res: Response, state?: string, lga?: string): Promise<void>;
    exportRegistrationsCSV(res: Response, agentId?: string, status?: string): Promise<void>;
}
//# sourceMappingURL=export.controller.d.ts.map