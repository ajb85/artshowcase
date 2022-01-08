import ImageUpload from "./";
import { action } from "@storybook/addon-actions";

export default {
  component: ImageUpload,
  title: "atoms/ImageUpload",
};

const defaultProps = { setLink: () => {} };

const Template = (args) => <ImageUpload {...args} />;

export const Default = Template.bind({});

Default.args = {
  ...defaultProps,
};
