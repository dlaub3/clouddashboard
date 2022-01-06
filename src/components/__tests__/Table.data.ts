import faker from "faker";
import { InstanceRow } from "../../types";

const getFakeInstanceRow = (): InstanceRow => ({
  id: faker.random.word(),
  name: faker.random.word(),
  instanceId: faker.random.word(),
  type: faker.random.word(),
  state: faker.random.word(),
  availabilityZone: faker.random.word(),
  publicIP: faker.random.word(),
  privateIP: faker.random.word(),
});

export const fakeRowData = Array.from({ length: 200 }, getFakeInstanceRow);
