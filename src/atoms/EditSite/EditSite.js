// @flow
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import type { Node } from "react";
import { SketchPicker } from "react-color";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  FormGroup,
  FormInput,
  FormSelect,
  Slider as ShardsSlider,
  Button,
} from "shards-react";
import * as LoadingIcons from "react-loading-icons";

import { Logo } from "atoms/";
import { useColors, useText } from "hooks";
import {
  combineClasses,
  addSubscription,
  stopProp,
  findDataAttribute,
  areEqual,
} from "js";

import s from "./EditSite.module.scss";
import LoadingIcon from "atoms/LoadingIcon";

type Props = {};

const iconChoices = Object.keys(LoadingIcons).filter(
  (name) => name !== "default"
);

export default function EditSite(props: Props): Node {
  const navigate = useNavigate();
  const { get: getColors, reset: resetColors, error, save } = useColors();
  const language = useText();
  const originalColors = useMemo(() => getColors(), [getColors]);
  const [colors, setColors] = useState(originalColors);
  const [open, setOpen] = useState(null);
  const [text, setText] = useState(language.text);

  const removeSub = useRef();

  const handleOpen = useCallback((e) => {
    const colorName = findDataAttribute(e, "name");
    if (colorName) {
      setOpen((state) => (state === colorName ? null : colorName));
    }
  }, []);

  const updateText = useCallback((e) => {
    const { name, value } = e.target;
    setText((state) => ({ ...state, [name]: value }));
  }, []);

  const updateSliders = useCallback(
    (name) =>
      ([value]) => {
        updateText({ target: { value: parseFloat(value), name } });
      },
    [updateText]
  );

  const colorsChanged = useMemo(
    () => !areEqual(originalColors, colors),
    [originalColors, colors]
  );

  const textChanged = useMemo(
    () => !areEqual(language.text, text),
    [language.text, text]
  );

  const changesMade = colorsChanged || textChanged;

  useEffect(() => {
    removeSub.current?.();
    removeSub.current = addSubscription("colorPicker", () => setOpen(null));
    return () => {
      removeSub.current?.();
      resetColors();
    };
  }, [resetColors]);

  return (
    <div className={s.editSite}>
      <MdArrowBack onClick={() => navigate("/manager")} />
      <h2>Website Editor</h2>
      {error && <p className={s.error}>{error}</p>}
      {changesMade && (
        <div className={s.save}>
          <Button onClick={() => save({ colors, text })}>Save</Button>
        </div>
      )}
      <Section title="Background">
        <Color
          label="Color"
          name="background"
          color={colors.background}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
      </Section>

      <Section title="Logo">
        <Logo>{text.logo}</Logo>
        <Input
          label="Logo Text"
          name="logo"
          value={text.logo}
          onChange={updateText}
        />
        <Color
          label="Main Color"
          name="logo-main"
          color={colors["logo-main"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
        <Color
          label="Outline Color"
          name="logo-stroke"
          color={colors["logo-stroke"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
        <Color
          label="Shadow Color"
          name="logo-shadow"
          color={colors["logo-shadow"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
      </Section>

      <Section title="Loading">
        <LoadingIcon
          className={combineClasses(s.center, s.column)}
          stroke={colors["loading-icon-stroke"]}
          fill={colors["loading-icon"]}
          text={text.loading}
          icon={text.loadingIcon}
          speed={text.iconSpeed}
          strokeWidth={text.iconStroke}
        />
        <Input
          label="Loading Text"
          name="loading"
          value={text.loading}
          onChange={updateText}
        />
        <FormSelect
          value={text.loadingIcon}
          name="loadingIcon"
          onChange={updateText}
        >
          {iconChoices.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </FormSelect>
        <Color
          label="Main Color"
          name="loading-icon"
          color={colors["loading-icon"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
        <Color
          label="Outline Color"
          name="loading-icon-stroke"
          color={colors["loading-icon-stroke"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
        <Color
          label="Text Color"
          name="loading-text"
          color={colors["loading-text"]}
          setColors={setColors}
          open={open}
          onClick={handleOpen}
        />
        <Slider
          label="Icon Speed"
          name={"iconSpeed"}
          value={text.iconSpeed}
          onChange={updateSliders}
          min={0}
          max={2}
        />
      </Section>
    </div>
  );
}

function Input(props) {
  return (
    <FormGroup className={s.input}>
      <label>
        {props.label}
        <FormInput
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        />
      </label>
    </FormGroup>
  );
}

function Slider(props) {
  const { onChange } = props;
  const handleUpdate = useMemo(
    () => onChange(props.name),
    [onChange, props.name]
  );
  return (
    <div className={s.slider}>
      <label>
        {props.label} {props.value}
      </label>
      <ShardsSlider
        name={props.name}
        onChange={handleUpdate}
        onSlide={handleUpdate}
        start={[Number(props.value) || 0]}
        range={{ min: props.min, max: props.max }}
      />
    </div>
  );
}

function Section(props) {
  const isArray = Array.isArray(props.children);
  return (
    <div className={s.section}>
      <h3>{props.title}</h3>
      {isArray && props.children[0]}
      <div className={s.elements}>
        {isArray ? props.children.slice(1) : props.children}
      </div>
    </div>
  );
}

function Color(props) {
  const { setColors, name, color, onClick } = props;
  const open = props.open === name;

  const { preview } = useColors();
  const removePreview = useRef();
  const previewColors = useCallback(
    ({ hex }) => {
      let updatedState;
      setColors((state) => {
        updatedState = { ...state, [name]: hex };
        return updatedState;
      });

      removePreview.current = preview(updatedState);
    },
    [setColors, name, preview]
  );

  return (
    <div className={s.pickerWrapper} onClick={stopProp} data-name={name}>
      <div className={s.colorWrapper} onClick={onClick}>
        <p>{props.label}</p>
        <div className={combineClasses(s.tile, s[hyphenToCamelCase(name)])} />
      </div>
      {open && <SketchPicker color={color} onChangeComplete={previewColors} />}
    </div>
  );
}

function hyphenToCamelCase(str) {
  return str
    .split("-")
    .reduce(
      (acc, cur) =>
        acc.length
          ? acc + (cur[0].toUpperCase() + cur.substring(1))
          : cur.toLowerCase(),
      ""
    );
}
