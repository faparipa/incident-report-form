import { IncidentRecord } from '../types/incident';
import { formatDateToEU } from './date';

const REPORT_GENERATORS: Record<
  string,
  (r: IncidentRecord, dt: string, tm: string, nat: string, ag: string) => string
> = {
  Overstay: (r, dt, tm, nat, ag) => {
    const pronoun = r.gender === 'female' ? 'she' : 'he';
    return `On the ${dt}, at ${tm}, a ${nat} (${ag}, ${r.gender || 'unknown'} ${
      r.age || '??'
    } y/o), overstayed for ${
      r.overstayDays || '0'
    } days, ${pronoun} was issued a ticket for ${
      r.penalty || '0'
    } RON, and a BAN for entry for: ${r.banTime || '-'}months.`;
  },

  'Refusal of Entry': (r, dt, tm, nat, ag) => {
    const dir = r.entryExit || 'Entry';
    const isMinor = r.age !== '' && parseInt(r.age, 10) < 18;

    if (isMinor) {
      const pGender = r.parentGender || 'female';
      const pRelation = pGender === 'female' ? 'mother' : 'father';
      const pOppositeRelation = pGender === 'female' ? 'father' : 'mother';
      const pAgeStr = r.parensOld ? `${r.parensOld}yo` : '??yo';
      const childPossessive = r.gender === 'female' ? 'her' : 'his';
      const capGender = r.gender
        ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1)
        : 'Male';

      return `On ${dt} at the ${dir.toLowerCase()} side at ${
        r.time || '00:00'
      }, an ${nat} (Minor age, ${capGender}, ${
        r.age || '??'
      } yo), travelling with ${childPossessive} ${pRelation} ${nat} (${
        pGender.charAt(0).toUpperCase() + pGender.slice(1)
      }, ${pAgeStr}), was refusal of ${dir.toUpperCase()}. The minor was NOT allowed to leave the country with ${childPossessive} ${pRelation}, due to the conditions for ${dir.toLowerCase()}ing the country applicable to the minor child was not fulfilled. (No authorization from ${pOppositeRelation} to leave the country)`;
    }

    const capGender = r.gender
      ? r.gender.charAt(0).toUpperCase() + r.gender.slice(1)
      : 'Male';
    return `On the ${dt} At ${tm}, on the ${dir} line, a ${nat} (${capGender}, ${
      r.age || '??'
    } y/o) was refusal of entry, due to reasons: ${r.reason || '-'}`;
  },

  'Smuggling of goods': (r, dt, tm, nat, ag) => {
    return `On the ${dt}, at ${tm}, a ${nat} (${ag}, ${
      r.gender || 'unknown'
    }, ${r.age || '??'} y/o) was intercepted with smuggled goods (${
      r.whatGoods || 'unknown'
    }, amount: ${r.amountGoods || '0'}), hidden in: ${
      r.whereFounded || 'unknown'
    }.`;
  },
};

export const generateReport = (record: IncidentRecord): string => {
  const formattedDate = formatDateToEU(record.date);
  const timeStr = record.time ? `${record.time} Hrs.` : '--:-- Hrs.';
  const nat = record.nationality ? record.nationality.toUpperCase() : 'UNK';
  const isMinor = record.age !== '' && parseInt(record.age, 10) < 18;
  const ageGroup = isMinor ? 'Minor age' : 'Adult';

  const generator = REPORT_GENERATORS[record.incidentType];
  if (generator) {
    return generator(record, formattedDate, timeStr, nat, ageGroup);
  }

  if (record.incidentType.startsWith('Hit in Database')) {
    const dir = record.entryExit || 'Entry';
    return `On the ${formattedDate}, at ${timeStr}, on the ${dir} line, a ${nat} (${ageGroup}, ${
      record.gender || 'unknown'
    }, ${record.age || '??'} y/o.) was hit in ${
      record.reason || 'Database'
    } concerning to a ${nat} ${
      record.docuType || 'ID'
    }. The document was seized by the ROU border authorities.`;
  }

  return `On the ${formattedDate}, at ${timeStr}, an incident type: ${
    record.incidentType || 'Other'
  } was registered for a ${nat} (${ageGroup}, ${record.gender || 'unknown'}, ${
    record.age || '??'
  } y/o). Details/Reason: ${record.reason || '-'}.`;
};
