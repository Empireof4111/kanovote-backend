import { ExportService } from './export.service';
import { Response } from 'express';
export declare class ExportController {
    private exportService;
    constructor(exportService: ExportService);
    exportSupportersCSV(state?: string, lga?: string, status?: string, res?: Response): Promise<void>;
    exportAgentsCSV(state?: string, lga?: string, res?: Response): Promise<void>;
    exportRegistrationsCSV(agentId?: string, status?: string, res?: Response): Promise<void>;
}
//# sourceMappingURL=export.controller.d.ts.map