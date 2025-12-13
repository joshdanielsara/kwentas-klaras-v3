import type { Remark } from '@prisma/client';

export class RemarkSerializer {
  static formatRemark(remark: Remark) {
    return {
      id: remark.id,
      name: remark.name,
    };
  }

  static list(remarks: Remark[]) {
    return remarks.map(remark => this.formatRemark(remark));
  }

  static detail(remark: Remark | null) {
    return remark ? this.formatRemark(remark) : null;
  }
}
